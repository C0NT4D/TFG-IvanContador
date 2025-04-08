import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '@app/services/usuario.service';
import { LoadingComponent } from '@app/components/loading/loading.component';
import { ErrorComponent } from '@app/components/error/error.component';

@Component({
  selector: 'app-usuario-nuevo',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoadingComponent,
    ErrorComponent
  ],
  templateUrl: './nuevo.component.html',
  styleUrls: ['./nuevo.component.css']
})
export class NuevoComponent {
  usuarioForm: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    this.usuarioForm = this.fb.group({
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      rol: ['ROLE_USER', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.usuarioForm.valid) {
      this.loading = true;
      this.error = null;

      const userData = {
        nombre: this.usuarioForm.value.nombre,
        email: this.usuarioForm.value.email,
        contrasena: this.usuarioForm.value.contrasena,
        rol: this.usuarioForm.value.rol
      };

      this.usuarioService.createUsuario(userData).subscribe({
        next: (usuario) => {
          this.loading = false;
          if (usuario) {
            this.router.navigate(['/usuarios']);
          } else {
            this.error = 'Error al crear el usuario';
          }
        },
        error: (error) => {
          this.loading = false;
          this.error = 'Error al crear el usuario';
        }
      });
    } else {
      this.error = 'Por favor, complete todos los campos correctamente';
    }
  }

  cancelar(): void {
    this.router.navigate(['/usuarios']);
  }
} 