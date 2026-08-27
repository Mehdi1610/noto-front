import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/authService/auth-service';

@Component({
    selector: 'app-header',
    imports: [RouterLink],
    templateUrl: './header.html'
})
export class HeaderComponent {
    private authService = inject(AuthService);

    onLogout(): void {
        this.authService.logout();
    }
}