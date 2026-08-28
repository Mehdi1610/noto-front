import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StatutTache, TacheResponse } from '../../../core/models/tache.model';

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

    couleurPriorite(): string {
        switch (this.tache.priorite) {
            case 'HAUTE': return 'bg-red-100 text-red-700';
            case 'MOYENNE': return 'bg-yellow-100 text-yellow-700';
            case 'BASSE': return 'bg-gray-100 text-gray-600';
            default: return 'hidden';
        }
    }
}