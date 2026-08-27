export type Priorite = 'BASSE' | 'MOYENNE' | 'HAUTE';
export type StatutTache = 'A_FAIRE' | 'EN_COURS' | 'TERMINEE';

export interface TacheResponse {
    id: number;
    titre: string;
    description: string;
    statut: StatutTache;
    dateEcheance: string | null;
    priorite: Priorite;
}

export interface TacheCreateRequest {                                                                                                                                                                                                                                                                                                                                                                                                  
    titre: string;
    description?: string;
    dateEcheance?: string | null;
    priorite: Priorite;
}

export interface TacheUpdateRequest {
    titre: string;
    description?: string;
    dateEcheance?: string;
    priorite?: Priorite;
}

export interface TacheStatutUpdateRequest {
    statut: StatutTache;
}