import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header';
import { TacheItemComponent } from '../../taches/tache-item/tache-item';
import { TacheFormComponent } from '../../taches/tache-form/tache-form';
import { DossierService } from '../../../core/services/dossierService/dossier-service';
import { TacheService } from '../../../core/services/tacheService/tache-service';
import { DossierTreeResponse } from '../../../core/models/dossier.model';
import { StatutTache, TacheCreateRequest, TacheUpdateRequest } from '../../../core/models/tache.model';
import { FormsModule } from '@angular/forms';
import { afficherCouleurDossier, ChoixCouleurs } from '../../../shared/constant/couleurDossier';
import { TacheList } from "../../taches/tache-list/tache-list";

@Component({
    selector: 'app-dossier-detail',
    imports: [HeaderComponent, TacheFormComponent, RouterLink, FormsModule, TacheList],
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

        // --- Édition du dossier courant ---
    couleurs = ChoixCouleurs;
    enEditionDossier = signal(false);
    nomEdite = '';
    descriptionEditee = '';
    couleurEditee = signal('');
    erreurEdition = signal('');

    // --- Création de sous-dossier ---
    formulaireSousDossierOuvert = signal(false);
    nouveauNomSousDossier = '';
    nouvelleDescriptionSousDossier = '';
    nouvelleCouleurSousDossier = signal(ChoixCouleurs[0].valeur);

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

     // --- Édition du dossier courant ---
    ouvrirEditionDossier(): void {
        const d = this.dossier();
        if (!d) return;

        this.nomEdite = d.nom;
        this.descriptionEditee = d.description ?? '';
        this.couleurEditee.set(d.couleur || ChoixCouleurs[0].valeur);
        this.erreurEdition.set('');
        this.enEditionDossier.set(true);
    }

    annulerEditionDossier(): void {
        this.enEditionDossier.set(false);
    }

    selectionnerCouleurEdition(couleur: string): void {
        this.couleurEditee.set(couleur);
    }

    validerEditionDossier(): void {
        if (!this.nomEdite.trim()) return;

        this.dossierService.modifierDossier(this.dossierId, {
            nom: this.nomEdite.trim(),
            description: this.descriptionEditee.trim() || undefined,
            couleur: this.couleurEditee()
        }).subscribe({
            next: () => {
                this.enEditionDossier.set(false);
                this.chargerDossier();
            },
            error: () => this.erreurEdition.set('Erreur lors de la modification')
        });
    }

        afficherCouleurDossiers(valeur: string | null): string{
          return afficherCouleurDossier(valeur);
        }

    // --- Création de sous-dossier depuis cette page ---

    ouvrirFormulaireSousDossier(): void {
        this.nouveauNomSousDossier = '';
        this.nouvelleDescriptionSousDossier = '';
        this.nouvelleCouleurSousDossier.set(ChoixCouleurs[0].valeur);
        this.formulaireSousDossierOuvert.set(true);
    }

    annulerFormulaireSousDossier(): void {
        this.formulaireSousDossierOuvert.set(false);
    }

    selectionnerCouleurSousDossier(couleur: string): void {
        this.nouvelleCouleurSousDossier.set(couleur);
    }

    creerSousDossier(): void {
        if (!this.nouveauNomSousDossier.trim()) return;

        this.dossierService.creerDossier({
            nom: this.nouveauNomSousDossier.trim(),
            description: this.nouvelleDescriptionSousDossier,
            couleur: this.nouvelleCouleurSousDossier(),
            parentId: this.dossierId
        }).subscribe({
            next: () => {
                this.formulaireSousDossierOuvert.set(false);
                this.chargerDossier();
            },
            error: () => this.erreur.set('Erreur lors de la création du sous-dossier')
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

    ouvrirEditionTache(id: number): void{
        this.tacheEditionId.set(id);
    }

    fermerEditionTache():void{
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