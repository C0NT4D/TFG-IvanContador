import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UsuarioService } from '@app/services/usuario.service';
import { UserFormComponent } from '@app/components/user-form/user-form.component';
import { LoadingComponent } from '@app/components/loading/loading.component';
import { ErrorComponent } from '@app/components/error/error.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    UserFormComponent,
    LoadingComponent,
    ErrorComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loading = false;
  error: string | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  onLoginSubmit(userData: { email: string; contrasena: string }): void {
    this.loading = true;
    this.error = null;

    const loginData = {
      email: userData.email,
      contrasena: userData.contrasena
    };

    this.usuarioService.login(loginData.email, loginData.contrasena).subscribe({
      next: (usuario) => {
        this.loading = false;
        if (usuario) {
          this.router.navigate(['/usuarios/perfil']);
        } else {
          this.error = 'Credenciales inválidas';
        }
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Error al iniciar sesión';
      }
    });
  }
}