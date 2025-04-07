import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '@app/services/usuario.service';
import { Usuario } from '@app/models/usuario.model';
import { LoadingComponent } from '@app/components/loading/loading.component';
import { ErrorComponent } from '@app/components/error/error.component';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    LoadingComponent,
    ErrorComponent
  ],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuario: Usuario | null = null;
  loading = true;
  error: string | null = null;
  editMode = false;
  editedUsuario: Partial<Usuario> = {};

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.loadUsuario();
  }

  loadUsuario(): void {
    this.loading = true;
    this.error = null;
    // En un caso real, obtendríamos el ID del usuario del servicio de autenticación
    this.usuarioService.getUsuario(1).subscribe({
      next: (usuario) => {
        this.usuario = usuario || null;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar el perfil';
        this.loading = false;
      }
    });
  }

  toggleEditMode(): void {
    if (this.editMode && this.usuario) {
      this.editedUsuario = { ...this.usuario };
    }
    this.editMode = !this.editMode;
  }

  saveChanges(): void {
    if (!this.usuario || !this.editedUsuario) return;

    this.loading = true;
    this.error = null;

    this.usuarioService.updateUsuario(this.usuario.id, this.editedUsuario).subscribe({
      next: (updatedUsuario) => {
        this.usuario = updatedUsuario;
        this.editMode = false;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al actualizar el perfil';
        this.loading = false;
      }
    });
  }

  cancelEdit(): void {
    this.editMode = false;
    this.editedUsuario = {};
  }
}
