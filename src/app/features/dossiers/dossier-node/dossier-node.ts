import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { DossierTreeResponse } from '../../../core/models/dossier.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dossier-node',
  imports: [DossierNodeComponent],
  templateUrl: './dossier-node.html',
  styleUrl: './dossier-node.css',
})
export class DossierNodeComponent {

  private router = inject(Router); 
  
  @Input({required:true}) dossier!: DossierTreeResponse;
  @Output() supprimer = new EventEmitter<number>();
  @Output() ajouterSousDossier = new EventEmitter<number>();

  ouvert = signal(false);

  toggle(): void{
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

    // propage les événements des enfants vers le parent (bulle jusqu'au composant racine DossiersComponent)
    onSupprimerEnfant(id: number): void {
        this.supprimer.emit(id);
    }

    onAjouterSousDossierEnfant(id: number): void {
        this.ajouterSousDossier.emit(id);
    }
}
