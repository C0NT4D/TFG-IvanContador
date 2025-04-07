import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UsuarioService } from '@app/services/usuario.service';
import { UserFormComponent } from '@app/components/user-form/user-form.component';
import { LoadingComponent } from '@app/components/loading/loading.component';
import { ErrorComponent } from '@app/components/error/error.component';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    CommonModule,
    UserFormComponent,
    LoadingComponent,
    ErrorComponent
  ],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  loading = false;
  error: string | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  onRegistroSubmit(userData: { nombre: string; email: string; contrasena: string }): void {
    this.loading = true;
    this.error = null;

    const newUser = {
      nombre: userData.nombre,
      email: userData.email,
      contrasena: userData.contrasena
    };

    this.usuarioService.createUsuario(newUser).subscribe({
      next: (usuario) => {
        this.loading = false;
        if (usuario) {
          this.router.navigate(['/usuarios/login']);
        } else {
          this.error = 'Error al crear la cuenta';
        }
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Error al registrar usuario';
      }
    });
  }
}
