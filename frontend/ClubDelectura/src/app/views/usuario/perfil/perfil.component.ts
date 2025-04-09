import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@app/services/auth.service';
import { Usuario } from '@app/models/usuario.model';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuario: Usuario | null = null;
  editedUsuario: Usuario = {
    id: 0,
    nombre: '',
    email: '',
    contrasena: '',
    rol: 'user',
    fechaRegistro: new Date().toISOString(),
    lecturas: [],
    foros: [],
    mensajes: [],
    eventos: [],
    inscripcions: [],
    recomendacions: []
  };
  isEditing = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.usuario = this.authService.getCurrentUser();
    if (this.usuario) {
      this.editedUsuario = { ...this.usuario };
    }
  }

  startEditing() {
    this.isEditing = true;
  }

  cancelEditing() {
    this.isEditing = false;
    if (this.usuario) {
      this.editedUsuario = { ...this.usuario };
    }
  }

  saveChanges() {
    if (this.editedUsuario) {
      this.authService.setCurrentUser(this.editedUsuario);
      this.usuario = this.editedUsuario;
      this.isEditing = false;
    }
  }
}