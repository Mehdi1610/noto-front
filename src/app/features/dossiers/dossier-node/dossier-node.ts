import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { DossierTreeResponse } from '../../../core/models/dossier.model';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { afficherCouleurDossier, ChoixCouleurs } from '../../../shared/constant/couleurDossier';
import { DossierService } from '../../../core/services/dossierService/dossier-service';

@Component({
  selector: 'app-dossier-node',
  imports: [DossierNodeComponent, FormsModule],
  templateUrl: './dossier-node.html',
  styleUrl: './dossier-node.css',
})
export class DossierNodeComponent {

  private router = inject(Router); 
  private dossierService = inject(DossierService);
  
  @Input({required:true}) dossier!: DossierTreeResponse;
  @Output() supprimer = new EventEmitter<number>();
  @Output() ajouterSousDossier = new EventEmitter<number>();
  @Output() modifier = new EventEmitter<number>();

  ouvert = signal(true);
  couleurs = ChoixCouleurs;
  enEdition = signal(false);
  nomEdite='';
  couleurEditee = signal('');
  descriptionEditee="";
  erreurEdition=signal("");

  toggle(): void{
    if(!this.enEdition())
    this.ouvert.update(v => !v);
  }

  onSupprimer(event: Event): void{
    event.stopPropagation();
    this.supprimer.emit(this.dossier.id);
  }

  onAjouterSousDossier(event: Event): void{
    event.stopPropagation();
    this.ajouterSousDossier.emit(this.dossier.id);
  }

  onVoirDetail(event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/dossiers', this.dossier.id]);
  }


  onOuvrirEdition(event: Event): void{
    event.stopPropagation();
    this.nomEdite=this.dossier.nom,
    this.descriptionEditee=this.dossier.description?this.dossier.description:"";
    this.couleurEditee.set(this.dossier.couleur || ChoixCouleurs[9].valeur);
    this.enEdition.set(true);
  }

  annulerEdition(event: Event): void{
    event.stopPropagation();
    this.enEdition.set(false);
  }

  selectionnerCouleurEdition(couleur: string, event: Event): void {
        event.stopPropagation();
        this.couleurEditee.set(couleur);
    }

    validerEdition(event: Event): void {
        event.stopPropagation();
        if (!this.nomEdite.trim()) return;
       this.dossierService.modifierDossier(this.dossier.id, {
          nom: this.nomEdite.trim(),
          description: this.descriptionEditee.trim() || undefined,
          couleur: this.couleurEditee()
    }).subscribe({
      next: () => {
        this.modifier.emit(this.dossier.id);
        this.enEdition.set(false);

      },
      error: () => this.erreurEdition.set('Erreur lors de la modification')
    });
  }
    
    onSupprimerEnfant(id: number): void {
        this.supprimer.emit(id);
    }

    onAjouterSousDossierEnfant(id: number): void {
        this.ajouterSousDossier.emit(id);
    }

    onModifierDossier(id: number): void {
    this.modifier.emit(id);
  }

  afficherCouleurDossiers(couleur: string | null){
    return afficherCouleurDossier(couleur);
  }
}
