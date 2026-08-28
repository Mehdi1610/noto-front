import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header';
import { TacheItemComponent } from '../../taches/tache-item/tache-item';
import { TacheFormComponent } from '../../taches/tache-form/tache-form';
import { DossierService } from '../../../core/services/dossierService/dossier-service';
import { TacheService } from '../../../core/services/tacheService/tache-service';
import { DossierTreeResponse } from '../../../core/models/dossier.model';
import { StatutTache, TacheCreateRequest, TacheUpdateRequest } from '../../../core/models/tache.model';

@Component({
    selector: 'app-dossier-detail',
    imports: [HeaderComponent, TacheItemComponent, TacheFormComponent, RouterLink],
    templateUrl: './dossier-detail.html'
})
export class DossierDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private dossierService = inject(DossierService);
    private tacheService = inject(TacheService);


    
    dossier = signal<DossierTreeResponse | null>(null);
    chargement = signal(true);
    erreur = signal('');
    formulaireOuvert = signal(false);
    tacheEditionId = signal<number | null>(null);

    private dossierId!: number;

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const id = Number(params.get('id'));
            if (id) {
                this.dossierId = id;
                this.chargerDossier();
            }
        });
    }


    chargerDossier(): void {
        this.chargement.set(true);
        this.dossierService.obtenirDossier(this.dossierId).subscribe({
            next: (data) => {
                this.dossier.set(data);
                this.chargement.set(false);
            },
            error: () => {
                this.erreur.set('Dossier introuvable');
                this.chargement.set(false);
            }
        });
    }

    creerTache(request: TacheCreateRequest): void {
        this.tacheService.creerTache(this.dossierId, request).subscribe({
            next: () => {
                this.formulaireOuvert.set(false);
                this.chargerDossier();
            },
            error: () => this.erreur.set('Erreur lors de la création de la tâche')
        });
    }

    ouvrirEdition(id: number): void{
        this.tacheEditionId.set(id);
    }

    fermerEdition():void{
        this.tacheEditionId.set(null);
    }

    modifierTache(id: number, request: TacheUpdateRequest): void{
        this.tacheService.modifierTache(id, request).subscribe({
            next: () =>{
                this.tacheEditionId.set(null);
                this.chargerDossier();
            },
            error: () => this.erreur.set('Erreur lors de la modification')
        })
    }



    changerStatutTache(event: { id: number; statut: StatutTache }): void {
        this.tacheService.changerStatut(event.id, event.statut).subscribe({
            next: () => this.chargerDossier(),
            error: () => this.erreur.set('Erreur lors de la mise à jour')
        });
    }

    supprimerTache(id: number): void {
        this.tacheService.supprimerTache(id).subscribe({
            next: () => this.chargerDossier(),
            error: () => this.erreur.set('Erreur lors de la suppression')
        });
    }

    ouvrirSousDossier(id: number): void {
        this.router.navigate(['/dossiers', id]);
    }

    ouvrirDossierParent(): void {
        const parentId = this.dossier()?.parentId;
        if(parentId){
            this.router.navigate(['/dossiers', parentId]);
        }
    }
} 