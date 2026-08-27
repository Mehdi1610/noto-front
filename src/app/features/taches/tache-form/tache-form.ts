import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TacheCreateRequest } from '../../../core/models/tache.model';

@Component({
    selector: 'app-tache-form',
    imports: [ReactiveFormsModule],
    templateUrl: './tache-form.html'
})
export class TacheFormComponent {
    private fb = inject(FormBuilder);

    @Output() creer = new EventEmitter<TacheCreateRequest>();
    @Output() annuler = new EventEmitter<void>();

    form = this.fb.group({
        titre: ['', [Validators.required, Validators.maxLength(150)]],
        description: [''],
        dateEcheance: [''],
        priorite: ['']
    });

    onSubmit(): void {
        if (this.form.invalid) return;

        const valeurs = this.form.getRawValue();
        const request: TacheCreateRequest = {
            titre: valeurs.titre!.trim(),
            description: valeurs.description || undefined,
            dateEcheance: valeurs.dateEcheance || undefined,
            priorite: (valeurs.priorite as any) || undefined
        };

        this.creer.emit(request);
        this.form.reset();
    }
}