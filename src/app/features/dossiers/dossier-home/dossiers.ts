import { Component, inject, OnInit, signal } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header';
import { DossierNodeComponent } from '../dossier-node/dossier-node';
import { FormsModule } from '@angular/forms';
import { DossierService } from '../../../core/services/dossierService/dossier-service';
import { CHOIX_COULEUR, ChoixCouleurs, afficherCouleurDossier } from '../../../shared/constant/couleurDossier';
import { DossierTreeResponse } from '../../../core/models/dossier.model';
@Component({
  selector: 'app-dossiers',
  imports: [HeaderComponent, DossierNodeComponent, FormsModule],
  templateUrl: './dossiers.html',
  styleUrl: './dossiers.css',
})
export class DossiersComponent implements OnInit{

  private dossierService = inject(DossierService);

    couleur: CHOIX_COULEUR = ChoixCouleurs[9];
    couleurs: CHOIX_COULEUR[]= ChoixCouleurs;
    arborescence = signal<DossierTreeResponse[]>([]);
    chargement = signal(true);
    erreur = signal('');

    formulaireOuvert = signal(false);
    parentIdCible = signal<number|null>(null);
    nouveauNom = '';
    nouvelleDescription = '';
    nouvelleCouleur = signal(ChoixCouleurs[0].valeur);

    ngOnInit(): void {
      this.chargerArborescence();
    }

    chargerArborescence(): void{
      this.chargement.set(true);
      this.dossierService.obtenirArborescence().subscribe({
        next: (data) =>{
          this.arborescence.set(data);
          this.chargement.set(false);
        },
        error: () => {
                this.erreur.set('Impossible de charger les dossiers');
                this.chargement.set(false);
            }
      });
    }

    ouvrirFormulaireRacine(): void{
      this.parentIdCible.set(null);
      this.nouveauNom = '';
      this.nouvelleCouleur.set(ChoixCouleurs[0].valeur);
      this.formulaireOuvert.set(true);
    }

    ouvrirFormulaireSousDossier(parentId:number): void{
      this.parentIdCible.set(parentId);
      this.nouveauNom = '';
      this.nouvelleDescription = ''
      this.nouvelleCouleur.set(ChoixCouleurs[0].valeur);
      this.formulaireOuvert.set(true);
    }

    annulerFormulaire(): void{
      this.formulaireOuvert.set(false);
    }

    selectionnerCouleur(couleur: string): void{
      this.nouvelleCouleur.set(couleur);
    }


    afficherCouleurDossiers(valeur: string): string{
      return afficherCouleurDossier(valeur);
    }
          
        
    

    creerDossier():void{
      if (!this.nouveauNom.trim()) return;

        this.dossierService.creerDossier({
            nom: this.nouveauNom.trim(),
            parentId: this.parentIdCible(),
            description: this.nouvelleDescription,
            couleur: this.nouvelleCouleur()
        }).subscribe({
            next: () => {
                this.formulaireOuvert.set(false);
                this.chargerArborescence(); // recharge tout l'arbre pour refléter le nouveau dossier
            },
            error: () => this.erreur.set('Erreur lors de la création du dossier')
        });
    }

    onDossierModifie(id: number): void {
    this.chargerArborescence();
}
    supprimerDossier(id: number): void {
        if (!confirm('Supprimer ce dossier et tout son contenu (sous-dossiers et tâches) ?')) return;

        this.dossierService.supprimerDossier(id).subscribe({
            next: () => this.chargerArborescence(),
            error: () => this.erreur.set('Erreur lors de la suppression')
        });
    }

}

