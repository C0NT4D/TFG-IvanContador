import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { Usuario } from '@app/models/usuario.model';

// Definición del validador de coincidencia de contraseñas (si no está global)
export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  if (!password || !confirmPassword || !password.value || !confirmPassword.value) {
    return null;
  }
  return password.value === confirmPassword.value ? null : { passwordMismatch: true };
};

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: passwordMatchValidator
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    this.errorMessage = null;
    if (this.registerForm.valid) {
      const { nombre, email, password } = this.registerForm.value;
      // Asegúrate de que AuthService ahora tenga el método 'register'
      this.authService.register({ nombre, email, password }).subscribe({
        next: () => {
          // Redirigir al login tras éxito
          this.router.navigate(['/login'], { queryParams: { registered: 'success' } });
        },
        // Añadir tipo aquí
        error: (error: Error | any) => {
          console.error('Registration failed:', error);
          // Intentar extraer el mensaje específico
          this.errorMessage = error?.message || error?.error?.message || 'Error durante el registro. Inténtalo de nuevo.';
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
