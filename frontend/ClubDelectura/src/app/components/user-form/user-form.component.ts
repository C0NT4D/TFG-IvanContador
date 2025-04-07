import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Usuario } from '@app/models/usuario.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent {
  @Input() mode: 'login' | 'register' = 'login';
  @Output() submitForm = new EventEmitter<any>();
  @Output() submitLogin = new EventEmitter<{ email: string; contrasena: string }>();
  @Output() submitRegister = new EventEmitter<{ nombre: string; email: string; contrasena: string }>();

  userForm: FormGroup;
  error: string | null = null;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      nombre: ['', this.mode === 'register' ? [Validators.required] : []]
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;
      
      if (this.mode === 'login') {
        this.submitLogin.emit({
          email: formValue.email,
          contrasena: formValue.contrasena
        });
      } else {
        this.submitRegister.emit({
          nombre: formValue.nombre,
          email: formValue.email,
          contrasena: formValue.contrasena
        });
      }
      
      this.submitForm.emit(formValue);
    } else {
      this.error = 'Por favor, complete todos los campos correctamente';
    }
  }
} 