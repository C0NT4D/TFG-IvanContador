import { Component, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { Usuario } from '@app/models/usuario.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TitleCasePipe,
  ],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuario: Usuario | null = null;
  editedUsuario: Usuario | null = null;
  isEditing = false;
  inscripciones: any[] = []; 
  perfilForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isLoading = false;
  selectedAvatar: string = '';
  showAvatarSelector = false;

  estadisticas = {
    librosLeidos: 0,
    librosEnProgreso: 0,
    librosPendientes: 0
  };

  avatares = [
    'assets/avatars/avatar1.png',
    'assets/avatars/avatar2.png',
    'assets/avatars/avatar3.png',
    'assets/avatars/avatar4.png'
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient
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
      this.selectedAvatar = localStorage.getItem(`avatar_${this.usuario.id}`) || this.avatares[0];
      this.cargarEstadisticas();
    }
  }

  cargarEstadisticas() {
    if (this.usuario) {
      this.http.get(`/api/lecturas/usuario/${this.usuario.id}/estadisticas`).subscribe({
        next: (data: any) => {
          this.estadisticas = data;
        },
        error: (error) => {
          console.error('Error al cargar estadísticas:', error);
        }
      });
    }
  }

  toggleAvatarSelector() {
    this.showAvatarSelector = !this.showAvatarSelector;
  }

  selectAvatar(avatar: string) {
    this.selectedAvatar = avatar;
    if (this.usuario) {
      localStorage.setItem(`avatar_${this.usuario.id}`, avatar);
    }
    this.showAvatarSelector = false;
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
      const updatedUser = { ...this.usuario, ...this.editedUsuario };
      this.authService.setCurrentUser(updatedUser);
      this.usuario = updatedUser;
      this.isEditing = false;
    }
  }

  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;
    
    if (this.perfilForm.valid && this.perfilForm.dirty && this.usuario) {
      this.isLoading = true;
      
      const updatedName = this.perfilForm.get('nombre')?.value;
      
      const updateData = {
        nombre: updatedName,
        email: this.usuario.email,
        rol: this.usuario.rol
      };
      
      this.http.put(`/api/usuario/${this.usuario.id}`, updateData)
        .subscribe({
          next: (response: any) => {
            this.isLoading = false;
            
            const updatedUser = {
              ...this.usuario!,
              nombre: updatedName
            };
            
            this.authService.setCurrentUser(updatedUser);
            this.usuario = updatedUser;
            
            this.successMessage = 'Perfil actualizado correctamente';
            this.perfilForm.markAsPristine(); 
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = error.message || 'Error al actualizar el perfil';
            console.error('Error al actualizar el perfil:', error);
          }
        });
    } else {
      if (!this.perfilForm.dirty) {
        this.errorMessage = 'No hay cambios para guardar';
      } else if (!this.perfilForm.valid) {
        this.errorMessage = 'Por favor, completa correctamente todos los campos';
      }
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}