import { Component, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { Usuario } from '@app/models/usuario.model';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    TitleCasePipe,
  ],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuario: Usuario | null = null;
  editedUsuario: Usuario | null = null;
  isEditing = false;
  inscripciones: any[] = []; // TODO: Tipar correctamente con el modelo de Inscripcion
  perfilForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.perfilForm = this.fb.group({
      nombre: [''],
      email: [{ value: '', disabled: true }]
    });
  }

  ngOnInit(): void {
    this.usuario = this.authService.getCurrentUser();
    if (this.usuario) {
      this.editedUsuario = { ...this.usuario };
      this.perfilForm.patchValue({
        nombre: this.usuario.nombre,
        email: this.usuario.email
      });
    }
  }

  startEditing() {
    this.isEditing = true;
  }

  cancelEditing() {
    this.isEditing = false;
    this.editedUsuario = this.usuario ? { ...this.usuario } : null;
  }

  saveChanges() {
    if (this.editedUsuario) {
      // TODO: Implementar la actualización del usuario
      this.usuario = { ...this.editedUsuario };
      this.isEditing = false;
    }
  }

  onSubmit(): void {
    if (this.perfilForm.valid && this.perfilForm.dirty) {
      console.log('Guardando cambios del perfil:', this.perfilForm.getRawValue());
    } else {
      console.log('Formulario no válido o sin cambios.');
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}