import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StatutTache, TacheCreateRequest, TacheResponse, TacheUpdateRequest } from '../../models/tache.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TacheService {
    private http = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}`;

    // --- Tâches dans un dossier ---
    creerTache(dossierId: number, request: TacheCreateRequest): Observable<TacheResponse> {
        return this.http.post<TacheResponse>(`${this.baseUrl}/dossiers/${dossierId}/taches`, request);
    }

    listerTachesParDossier(dossierId: number): Observable<TacheResponse[]> {
        return this.http.get<TacheResponse[]>(`${this.baseUrl}/dossiers/${dossierId}/taches`);
    }

    // --- Tâches racines (sans dossier) ---
    creerTacheRacine(request: TacheCreateRequest): Observable<TacheResponse> {
        return this.http.post<TacheResponse>(`${this.baseUrl}/taches`, request);
    }

    listerTachesRacines(): Observable<TacheResponse[]> {
        return this.http.get<TacheResponse[]>(`${this.baseUrl}/taches/racine`);
    }

    // --- Opérations directes sur une tâche ---
    obtenirTache(id: number): Observable<TacheResponse> {
        return this.http.get<TacheResponse>(`${this.baseUrl}/taches/${id}`);
    }

    modifierTache(id: number, request: TacheUpdateRequest): Observable<TacheResponse> {
        return this.http.put<TacheResponse>(`${this.baseUrl}/taches/${id}`, request);
    }

    changerStatut(id: number, statut: StatutTache): Observable<TacheResponse> {
        return this.http.patch<TacheResponse>(`${this.baseUrl}/taches/${id}/statut`, { statut });
    }

    supprimerTache(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/taches/${id}`);
    }
}
