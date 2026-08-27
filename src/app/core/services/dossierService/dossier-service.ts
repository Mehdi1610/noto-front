import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { DossierCreateRequest, DossierMoveRequest, DossierResponse, DossierTreeResponse, DossierUpdateRequest } from '../../models/dossier.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DossierService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/dossiers` ;


  creerDossier(request: DossierCreateRequest): Observable<DossierResponse>{
    return this.http.post<DossierResponse>(this.baseUrl,request);
  }

  listerRacines(): Observable<DossierResponse[]>{
    return this.http.get<DossierResponse[]>(this.baseUrl);
  }

  obtenirArborescence(): Observable<DossierTreeResponse[]>{
    return this.http.get<DossierTreeResponse[]>(`${this.baseUrl}/arbre`);
  }

  obtenirDossier(id:number): Observable<DossierTreeResponse>{
    return this.http.get<DossierTreeResponse>(`${this.baseUrl}/${id}`);
  }

  modifierDossier(id: number, request: DossierUpdateRequest): Observable<DossierResponse>{
        return this.http.put<DossierResponse>(`${this.baseUrl}/${id}`,request);
  }

 deplacerDossier(id: number, request: DossierMoveRequest): Observable<DossierResponse> {
    return this.http.put<DossierResponse>(`${this.baseUrl}/${id}/deplacer`, request);
}

  supprimerDossier(id: number): Observable<void> {
      return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
