import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TacheCreateRequest, TacheResponse, TacheUpdateRequest } from '../../../core/models/tache.model';

@Component({
    selector: 'app-tache-form',
    imports: [ReactiveFormsModule],
    templateUrl: './tache-form.html'
})
export class TacheFormComponent implements OnInit{
    private fb = inject(FormBuilder);

    @Input() tacheInitiale: TacheResponse | null = null;
    @Output() creer = new EventEmitter<TacheCreateRequest>();
    @Output() modifier = new EventEmitter<TacheUpdateRequest>();
    @Output() annuler = new EventEmitter<void>();

    form = this.fb.group({
        titre: ['', [Validators.required, Validators.maxLength(150)]],
        description: [''],
        dateEcheance: [''],
        priorite: ['']
    });

    get estEdition(): boolean{
        return this.tacheInitiale !== null;
    }

    ngOnInit(): void {
        if(this.tacheInitiale){
            this.form.patchValue({
                titre: this.tacheInitiale.titre,
                description: this.tacheInitiale.description ?? '',
                dateEcheance: this.tacheInitiale.dateEcheance ?? '',
                priorite: this.tacheInitiale.priorite ?? '',
            })
        }
    }
    onSubmit(): void {
        if (this.form.invalid) return;

        const valeurs = this.form.getRawValue();
        const base = {
            titre: valeurs.titre!.trim(),
            description: valeurs.description || undefined,
            dateEcheance: valeurs.dateEcheance || undefined,
            priorite: (valeurs.priorite as any) || undefined
        };

        if(this.estEdition){
            this.modifier.emit(base as TacheUpdateRequest);
        }else{
            this.creer.emit(base as TacheCreateRequest);
             this.form.reset();
        }
        
    }
}
