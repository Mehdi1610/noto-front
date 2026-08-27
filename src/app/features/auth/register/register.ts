import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/authService/auth-service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './register.html'
})
export class RegisterComponent {
    errorMessage = '';
    loading = false;

      private  fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);
    

    form = this.fb.group({
        username: ['', [Validators.required, Validators.maxLength(50)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(4)]]
    });



    onSubmit(): void {
        if (this.form.invalid) return;

        this.loading = true;
        this.errorMessage = '';

        this.authService.register(this.form.getRawValue() as {
            username: string; email: string; password: string;
        }).subscribe({
            next: () => this.router.navigate(['/dossiers']),
            error: (err) => {
                this.errorMessage = err.error?.message ?? 'Erreur lors de l\'inscription';
                this.loading = false;
            }
        });
    }
}