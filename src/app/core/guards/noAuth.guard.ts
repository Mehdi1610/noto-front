import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/authService/auth-service';

export const noAuthGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
        return true; // pas connecté -> accès autorisé à login/register
    }

    router.navigate(['/taches']); // déjà connecté -> redirection, pas d'accès à login/register
    return false;
};