import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header';
import { TacheItemComponent } from '../tache-item/tache-item';
import { TacheFormComponent } from '../tache-form/tache-form';
import { TacheService } from '../../../core/services/tacheService/tache-service';
import { StatutTache, TacheCreateRequest, TacheResponse, TacheUpdateRequest } from '../../../core/models/tache.model';
import { couleurPriorite } from '../../../shared/constant/couleurPriorite';
import { TacheList } from "../tache-list/tache-list";

@Component({
    selector: 'app-taches-racines',
    imports: [HeaderComponent, TacheItemComponent, TacheFormComponent, TacheList],
    templateUrl: './tache-racines.html'
})
export class TachesRacinesComponent implements OnInit {
    private tacheService = inject(TacheService);

    tachesRacines = signal<TacheResponse[]>([]);
    tachesRestantes = signal<TacheResponse[]>([]);
    erreur = signal('');
    formulaireOuvert = signal(false);
    tacheEnEditionId = signal<number|null>(null);

    chargementTachesRapides = signal(true);
    chargementTachesAFaire = signal(true);
    
    filtrePriorite = signal<string>('TOUT');

    private readonly ordreStatuts: Record<string, number> = {
            'A_FAIRE': 1,
            'EN_COURS': 2,
            'TERMINEE': 3
        };

    // 2. Helper privé de filtrage et tri
  private filtrerEtTrierPriorite(liste: TacheResponse[], filtre: string): TacheResponse[] {
    const listeFiltree = filtre === 'TOUT'
      ? liste
      : liste.filter(t => t.priorite === filtre);

    return [...listeFiltree].sort((a, b) => {
      const ordreA = this.ordreStatuts[a.statut] ?? 99;
      const ordreB = this.ordreStatuts[b.statut] ?? 99;
      return ordreA - ordreB;
    });
  }

  // 3. Computed Signals pour chaque liste de tâches
  tachesRacinesAffichees = computed(() => 
    this.filtrerEtTrierPriorite(this.tachesRacines(), this.filtrePriorite())
  );

  tachesRestantesAffichees = computed(() => 
    this.filtrerEtTrierPriorite(this.tachesRestantes(), this.filtrePriorite())
  );

    ngOnInit(): void {
        this.charger();
    }   

    charger(): void {

        this.chargementTachesRapides.set(true);
        this.chargementTachesAFaire.set(true);
        this.tacheService.listerTachesRacines().subscribe({
            next: (data) => {
                this.tachesRacines.set(data); // Tâches rapides
                this.chargementTachesRapides.set(false);
            },
            error: () => {
                this.erreur.set('Impossible de charger les tâches');
                this.chargementTachesRapides.set(false);
            }
        });
        this.tacheService.listerTaches().subscribe({
             next: (data) => {
                this.tachesRestantes.set(data); // Tâches a faire
                this.chargementTachesAFaire.set(false);
            },
            error: () => {
                this.erreur.set('Impossible de charger les tâches');
                this.chargementTachesAFaire.set(false);
            }
        })
    }
    filtrerParPriorite(priorite: string): void {
        if(priorite === this.filtrePriorite()){
            this.filtrePriorite.set('TOUT');
        }else{
    this.filtrePriorite.set(priorite);
        }

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

    ouvrirEdition(id: number): void{
        this.tacheEnEditionId.set(id);
    }

    
    fermerEdition(): void{
        this.tacheEnEditionId.set(null);
    }

     modifierTache(id: number, request: TacheUpdateRequest): void{
            this.tacheService.modifierTache(id, request).subscribe({
                next: () =>{
                    this.tacheEnEditionId.set(null);
                    this.charger();
                },
                error: () => this.erreur.set('Erreur lors de la modification')
            })
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

    prioriteCouleur(priorite: string): string{
        return couleurPriorite(priorite);
    }
}