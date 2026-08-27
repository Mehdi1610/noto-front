import { Component, inject, OnInit, signal } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header';
import { DossierNodeComponent } from '../dossier-node/dossier-node';
import { FormsModule } from '@angular/forms';
import { DossierService } from '../../../core/services/dossierService/dossier-service';
import { DossierTreeResponse } from '../../../core/models/dossier.model';

@Component({
  selector: 'app-dossiers',
  imports: [HeaderComponent, DossierNodeComponent, FormsModule],
  templateUrl: './dossiers.html',
  styleUrl: './dossiers.css',
})
export class DossiersComponent implements OnInit{

  private dossierService = inject(DossierService);

    arborescence = signal<DossierTreeResponse[]>([]);
    chargement = signal(true);
    erreur = signal('');

    formulaireOuvert = signal(false);
    parentIdCible = signal<number|null>(null);
    nouveauNom = '';

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
      this.formulaireOuvert.set(true);
    }

    ouvrirFormulaireSousDossier(parentId:number): void{
      this.parentIdCible.set(parentId);
      this.nouveauNom = '';
      this.formulaireOuvert.set(true);
    }

    annulerFormulaire(): void{
      this.formulaireOuvert.set(false);
    }

    creerDossier():void{
      if (!this.nouveauNom.trim()) return;

        this.dossierService.creerDossier({
            nom: this.nouveauNom.trim(),
            parentId: this.parentIdCible()
        }).subscribe({
            next: () => {
                this.formulaireOuvert.set(false);
                this.chargerArborescence(); // recharge tout l'arbre pour refléter le nouveau dossier
            },
            error: () => this.erreur.set('Erreur lors de la création du dossier')
        });
    }
    supprimerDossier(id: number): void {
        if (!confirm('Supprimer ce dossier et tout son contenu (sous-dossiers et tâches) ?')) return;

        this.dossierService.supprimerDossier(id).subscribe({
            next: () => this.chargerArborescence(),
            error: () => this.erreur.set('Erreur lors de la suppression')
        });
    }
}

