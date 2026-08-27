import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../services/authService/auth-service';

// état partagé entre toutes les requêtes concurrentes pour éviter les refresh en double
let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // ne jamais attacher le token sur les routes d'auth elles-mêmes
    if (req.url.includes('/auth/login') || req.url.includes('/auth/register') || req.url.includes('/auth/refresh')) {
        return next(req);
    }

    const accessToken = authService.getAccessToken();
    const requeteAvecToken = accessToken
        ? req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } })
        : req;

    return next(requeteAvecToken).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                return gererRefresh(req, next, authService, router);
            }
            return throwError(() => error);
        })
    );
};

function gererRefresh(
    req: Parameters<HttpInterceptorFn>[0],
    next: Parameters<HttpInterceptorFn>[1],
    authService: AuthService,
    router: Router
) {
    if (!isRefreshing) {
        isRefreshing = true;
        refreshTokenSubject.next(null);

        return authService.refresh().pipe(
            switchMap(response => {
                isRefreshing = false;
                refreshTokenSubject.next(response.accessToken);

                const requeteRejouee = req.clone({
                    setHeaders: { Authorization: `Bearer ${response.accessToken}` }
                });
                return next(requeteRejouee);
            }),
            catchError(refreshError => {
                isRefreshing = false;
                authService.logout();
                router.navigate(['/login']);
                return throwError(() => refreshError);
            })
        );
    } else {
        // une requête refresh est déjà en cours : on attend son résultat au lieu d'en déclencher une 2e
        return refreshTokenSubject.pipe(
            filter(token => token !== null),
            take(1),
            switchMap(token => {
                const requeteRejouee = req.clone({
                    setHeaders: { Authorization: `Bearer ${token}` }
                });
                return next(requeteRejouee);
            })
        );
    }
}