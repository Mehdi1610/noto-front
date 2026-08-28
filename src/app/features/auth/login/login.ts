import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/authService/auth-service';

@Component({
    selector: 'app-login',
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './login.html'
})
export class LoginComponent {
    errorMessage = '';
    loading = false;

    private  fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);
    
    form = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required]
    });

    onSubmit(): void {
        if (this.form.invalid) return;

        this.loading = true;
        this.errorMessage = '';

        this.authService.login(this.form.getRawValue() as { email: string; password: string }).subscribe({
            next: () => this.router.navigate(['/taches']),
            error: () => {
                this.errorMessage = 'Email ou mot de passe incorrect';
                this.loading = false;
            }
        });
    }
}