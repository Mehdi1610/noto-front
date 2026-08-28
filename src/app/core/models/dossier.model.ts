import { TacheResponse } from "./tache.model";

export interface DossierCreateRequest{
    nom: string;
    description?: string;
    couleur?: string;
    parentId?: number | null;
}

export interface DossierResponse{
    id: number;
    nom: string;
    description: string | null;
    couleur: string | null;
    parentId: number | null;
    createdAt: string;
}

export interface DossierTreeResponse{
    id: number;
    nom: string;
    description: string | null;
    couleur: string | null;
    parentId: number | null;
    parentNom: string | null;
    sousDossiers: DossierTreeResponse[];
    taches: TacheResponse[];
}

export interface DossierUpdateRequest{
    nom: string;
    description?: string;
    couleur?: string;
}

export interface DossierMoveRequest{
    nouveauParentId: number | null
}