import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { noAuthGuard } from './core/guards/noAuth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
        path: 'login',
        canActivate: [noAuthGuard],
        loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent)
    },
    {
        path: 'register',
        canActivate: [noAuthGuard],
        loadComponent: () => import('./features/auth/register/register').then(m => m.RegisterComponent)
    },
    {
        path: 'dossiers',
        canActivate: [authGuard],
        loadComponent: () => import('./features/dossiers/dossier-home/dossiers').then(m => m.DossiersComponent)
        // ce composant n'existe pas encore, on le créera à l'étape suivante
    },
    {
    path: 'dossiers/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dossiers/dossier-detail/dossier-detail').then(m => m.DossierDetailComponent)
},
{
    path: 'taches',
    canActivate: [authGuard],
    loadComponent: () => import('./features/taches/tache-racines/tache-racines').then(m => m.TachesRacinesComponent)
},
    { path: '**', redirectTo: 'login' }
];