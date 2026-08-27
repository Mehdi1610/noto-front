import { Component, OnInit, inject, signal } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header';
import { TacheItemComponent } from '../tache-item/tache-item';
import { TacheFormComponent } from '../tache-form/tache-form';
import { TacheService } from '../../../core/services/tacheService/tache-service';
import { StatutTache, TacheCreateRequest, TacheResponse } from '../../../core/models/tache.model';

@Component({
    selector: 'app-taches-racines',
    imports: [HeaderComponent, TacheItemComponent, TacheFormComponent],
    templateUrl: './tache-racines.html'
})
export class TachesRacinesComponent implements OnInit {
    private tacheService = inject(TacheService);

    taches = signal<TacheResponse[]>([]);
    chargement = signal(true);
    erreur = signal('');
    formulaireOuvert = signal(false);

    ngOnInit(): void {
        this.charger();
    }

    charger(): void {
        this.chargement.set(true);
        this.tacheService.listerTachesRacines().subscribe({
            next: (data) => {
                this.taches.set(data);
                this.chargement.set(false);
            },
            error: () => {
                this.erreur.set('Impossible de charger les tâches');
                this.chargement.set(false);
            }
        });
    }

    creerTache(request: TacheCreateRequest): void {
        this.tacheService.creerTacheRacine(request).subscribe({
            next: () => {
                this.formulaireOuvert.set(false);
                this.charger();
            },
            error: () => this.erreur.set('Erreur lors de la création')
        });
    }

    changerStatutTache(event: { id: number; statut: StatutTache }): void {
        this.tacheService.changerStatut(event.id, event.statut).subscribe({
            next: () => this.charger(),
            error: () => this.erreur.set('Erreur lors de la mise à jour')
        });
    }

    supprimerTache(id: number): void {
        this.tacheService.supprimerTache(id).subscribe({
            next: () => this.charger(),
            error: () => this.erreur.set('Erreur lors de la suppression')
        });
    }
}