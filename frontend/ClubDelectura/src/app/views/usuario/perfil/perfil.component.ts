import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@app/services/auth.service';
import { Usuario } from '@app/models/usuario.model';
import { InscriptionCardComponent } from '../../../components/inscription-card/inscription-card.component';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    InscriptionCardComponent
  ],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuario: Usuario | null = null;
  editedUsuario: Usuario | null = null;
  isEditing = false;
  inscripciones: any[] = []; // TODO: Tipar correctamente con el modelo de Inscripcion

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.usuario = this.authService.getCurrentUser();
    if (this.usuario) {
      this.editedUsuario = { ...this.usuario };
      // TODO: Cargar las inscripciones del usuario
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
}