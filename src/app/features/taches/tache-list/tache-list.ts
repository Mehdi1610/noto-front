import { Component, computed, EventEmitter, inject, input, Input, OnInit, Output, signal } from '@angular/core';
import { TacheItemComponent } from '../tache-item/tache-item';
import { TacheFormComponent } from '../tache-form/tache-form';
import { TacheService } from '../../../core/services/tacheService/tache-service';
import { StatutTache, TacheResponse, TacheUpdateRequest } from '../../../core/models/tache.model';
import { couleurPriorite } from '../../../shared/constant/couleurPriorite';

@Component({
  selector: 'app-tache-list',
  imports: [TacheItemComponent, TacheFormComponent],
  templateUrl: './tache-list.html',
  styleUrl: './tache-list.css',
})
export class TacheList {
    private tacheService = inject(TacheService);

    @Input({ required: true }) taches: TacheResponse[] = [];
    displayDossier = input<boolean>(false);

    // le composant ne sait pas d'où viennent les données -> il demande juste au parent de recharger après une action
    @Output() rafraichir = new EventEmitter<void>();
    @Output() erreur = new EventEmitter<string>();

    filtrePriorite = signal<string>('TOUT');
    tacheEnEditionId = signal<number | null>(null);

    private readonly ordreStatuts: Record<string, number> = {
        'A_FAIRE': 1,
        'EN_COURS': 2,
        'TERMINEE': 3
    };

    tachesAffichees = computed(() => {
        const filtre = this.filtrePriorite();
        const liste = filtre === 'TOUT' ? this.taches : this.taches.filter(t => t.priorite === filtre);
        return [...liste].sort((a, b) => (this.ordreStatuts[a.statut] ?? 99) - (this.ordreStatuts[b.statut] ?? 99));
    });

    filtrerParPriorite(priorite: string): void {
        this.filtrePriorite.set(this.filtrePriorite() === priorite ? 'TOUT' : priorite);
    }


    ouvrirEdition(id: number): void {
        this.tacheEnEditionId.set(id);
    }

    fermerEdition(): void {
        this.tacheEnEditionId.set(null);
    }

    modifierTache(id: number, request: TacheUpdateRequest): void {
        this.tacheService.modifierTache(id, request).subscribe({
            next: () => {
                this.tacheEnEditionId.set(null);
                this.rafraichir.emit();
            },
            error: () => this.erreur.emit('Erreur lors de la modification')
        });
    }

    changerStatutTache(event: { id: number; statut: StatutTache }): void {
        this.tacheService.changerStatut(event.id, event.statut).subscribe({
            next: () => this.rafraichir.emit(),
            error: () => this.erreur.emit('Erreur lors de la mise à jour')
        });
    }

    supprimerTache(id: number): void {
        this.tacheService.supprimerTache(id).subscribe({
            next: () => this.rafraichir.emit(),
            error: () => this.erreur.emit('Erreur lors de la suppression')
        });
    }

    prioriteCouleur(priorite: string): string {
        return couleurPriorite(priorite);
    }
}
