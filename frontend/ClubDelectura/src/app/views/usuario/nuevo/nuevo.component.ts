import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

// Definición del validador de coincidencia de contraseñas
export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  // Si los controles aún no existen o no tienen valor, no validar
  if (!password || !confirmPassword || !password.value || !confirmPassword.value) {
    return null;
  }

  // Devuelve un error si las contraseñas no coinciden
  return password.value === confirmPassword.value ? null : { passwordMismatch: true };
};

@Component({
  selector: 'app-usuario-nuevo',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './nuevo.component.html',
  styleUrls: ['./nuevo.component.css']
})
export class NuevoComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage: string | null = null;
  loading = false;

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
    this.loading = true;

    if (this.registerForm.valid) {
      const { nombre, email, password } = this.registerForm.value;
      
      this.authService.register({ nombre, email, password }).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.loading = false;
          console.error('Registration failed:', error);
          this.errorMessage = error?.error?.message || error?.message || 'Error durante el registro. Inténtalo de nuevo.';
        }
      });
    } else {
      this.loading = false;
      this.registerForm.markAllAsTouched();
    }
  }

  cancelar(): void {
    this.router.navigate(['/login']);
  }
} 