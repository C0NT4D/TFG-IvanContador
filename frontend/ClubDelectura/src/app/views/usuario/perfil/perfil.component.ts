import { Component, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { Usuario } from '@app/models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { AvatarService } from '@app/services/avatar.service';
import { UsuarioService } from '@app/services/usuario.service';

interface Estadisticas {
  librosLeidos: number;
  librosEnProgreso: number;
  librosPendientes: number;
}

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
  passwordForm: FormGroup;
  showPasswordForm = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isLoading = false;
  selectedAvatar: string = '';
  showAvatarSelector = false;
  estadisticas: Estadisticas = {
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
    private http: HttpClient,
    private avatarService: AvatarService,
    private usuarioService: UsuarioService
  ) {
    this.perfilForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.loadUsuario(userId);
    }
  }

  loadUsuario(id: number): void {
    this.usuarioService.getUsuario(id).subscribe({
      next: (usuario) => {
        if (usuario) {
          this.usuario = usuario;
          this.perfilForm.patchValue({
            nombre: usuario.nombre,
            email: usuario.email
          });
          this.selectedAvatar = localStorage.getItem(`avatar_${this.usuario.id}`) || this.avatares[0];
          this.avatarService.updateAvatar(this.selectedAvatar);
          this.cargarEstadisticas(id);
        }
      },
      error: (error: Error) => {
        console.error('Error al cargar usuario:', error);
        this.errorMessage = 'Error al cargar los datos del usuario';
      }
    });
  }

  cargarEstadisticas(usuarioId: number): void {
    this.usuarioService.getEstadisticas(usuarioId).subscribe({
      next: (estadisticas: Estadisticas) => {
        this.estadisticas = estadisticas;
      },
      error: (error: Error) => {
        console.error('Error al cargar estadísticas:', error);
      }
    });
  }

  toggleAvatarSelector() {
    this.showAvatarSelector = !this.showAvatarSelector;
  }

  selectAvatar(avatar: string) {
    this.selectedAvatar = avatar;
    if (this.usuario) {
      localStorage.setItem(`avatar_${this.usuario.id}`, avatar);
      this.avatarService.updateAvatar(avatar);
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
    if (this.perfilForm.valid && this.usuario) {
      this.isLoading = true;
      this.usuarioService.updateUsuario(this.usuario.id, this.perfilForm.value).subscribe({
        next: (usuario) => {
          this.usuario = usuario;
          this.successMessage = 'Perfil actualizado correctamente';
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al actualizar perfil:', error);
          this.errorMessage = 'Error al actualizar el perfil';
          this.isLoading = false;
        }
      });
    }
  }

  togglePasswordForm(): void {
    this.showPasswordForm = !this.showPasswordForm;
    if (!this.showPasswordForm) {
      this.passwordForm.reset();
    }
  }

  onChangePassword(): void {
    if (this.passwordForm.valid && this.usuario) {
      this.isLoading = true;
      const { currentPassword, newPassword } = this.passwordForm.value;
      
      this.usuarioService.changePassword(this.usuario.id, {
        currentPassword,
        newPassword
      }).subscribe({
        next: () => {
          this.successMessage = 'Contraseña actualizada correctamente';
          this.showPasswordForm = false;
          this.passwordForm.reset();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al cambiar contraseña:', error);
          this.errorMessage = 'Error al cambiar la contraseña';
          this.isLoading = false;
        }
      });
    }
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}