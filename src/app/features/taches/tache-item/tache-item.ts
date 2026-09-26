import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { StatutTache, TacheResponse } from '../../../core/models/tache.model';
import { Router } from '@angular/router';
import { afficherCouleurDossier } from '../../../shared/constant/couleurDossier';
import { couleurPriorite } from '../../../shared/constant/couleurPriorite';

@Component({
  selector: 'app-tache-item',
  imports: [],
  templateUrl: './tache-item.html',
  styleUrl: './tache-item.css',
})
export class TacheItemComponent {

    @Input({ required: true }) tache!: TacheResponse;
    @Output() changerStatut = new EventEmitter<{ id: number; statut: StatutTache }>();
    @Output() supprimer = new EventEmitter<number>();
    @Output() modifier = new EventEmitter<number>();

    @Input() displayDossier: boolean = false;
    private route = inject(Router);
    
    get estTerminee(): boolean {
        return this.tache.statut === 'TERMINEE';
    }

    toggleStatut(): void {
        const nouveauStatut: StatutTache = this.estTerminee ? 'A_FAIRE' : 'TERMINEE';
        this.changerStatut.emit({ id: this.tache.id, statut: nouveauStatut });
    }

    onSupprimer(): void {
        this.supprimer.emit(this.tache.id);
    }

    onModifier(): void{
        this.modifier.emit(this.tache.id);
    }

    accederAuDossier() {
        this.route.navigate(["/dossiers", this.tache.dossier.id]);
}

    couleurPriorite(priorite: string): string {
        return couleurPriorite(priorite);
    }

    afficherCouleurDossiers(couleur: string | null): string{
        return afficherCouleurDossier(couleur);
    }
}