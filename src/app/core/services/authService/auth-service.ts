import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthResponse, LoginRequest, RegisterRequest } from '../../models/auth.model';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

@Injectable({
  providedIn: 'root',
})

export class AuthService {

    // signal réactif : les composants peuvent réagir à l'état connecté/déconnecté
    isAuthenticated = signal<boolean>(this.hasValidTokens());

    constructor(
        private http: HttpClient,
        private router: Router
    ) {}

    register(request: RegisterRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, request)
            .pipe(tap(response => this.saveToken(response)));
    }

    login(request: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, request)
            .pipe(tap(response => this.saveToken(response)));
    }

    refresh(): Observable<AuthResponse> {
        const refreshToken = this.getRefreshToken();
        return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/refresh`, { refreshToken })
            .pipe(tap(response => this.saveToken(response)));
    }

    logout(): void {
        const refreshToken = this.getRefreshToken();

        // on tente de révoquer le refresh token côté serveur, mais on nettoie le local dans tous les cas
        if (refreshToken) {
            this.http.post(`${environment.apiUrl}/auth/logout`, { refreshToken }).subscribe({
                complete: () => this.clearSession(),
                error: () => this.clearSession()
            });
        } else {
            this.clearSession();
        }
    }

    private clearSession(): void {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        this.isAuthenticated.set(false);
        this.router.navigate(['/login']);
    }

    private saveToken(response: AuthResponse): void {
        localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
        this.isAuthenticated.set(true);
    }

    getAccessToken(): string | null {
        return localStorage.getItem(ACCESS_TOKEN_KEY);
    }

    getRefreshToken(): string | null {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    }

    private hasValidTokens(): boolean {
        return !!this.getAccessToken() && !!this.getRefreshToken();
    }
}