import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Recomendacion } from '@app/models/recomendacion.model';
import { Usuario } from '@app/models/usuario.model';
import { Libro } from '@app/models/libro.model';
import { AuthService, User } from '@app/services/auth.service';

@Component({
  selector: 'app-recomendacion-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './recomendacion-form.component.html',
  styleUrls: ['./recomendacion-form.component.css']
})
export class RecomendacionFormComponent {
  @Input() recomendacion: Recomendacion | null = null;
  @Output() submit = new EventEmitter<Omit<Recomendacion, 'id'>>();
  @Output() cancel = new EventEmitter<void>();
  
  recomendacionForm: FormGroup;
  currentUser: User | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    console.log('Constructor del formulario llamado');
    this.recomendacionForm = this.fb.group({
      titulo: ['', [Validators.required]],
      autor: ['', [Validators.required]],
      genero: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      razonRecomendacion: ['', [Validators.required]]
    });

    this.currentUser = this.authService.getCurrentUser();
  }

  private convertUserToUsuario(user: User): Usuario {
    return {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      contrasena: '', // No necesitamos la contraseña para la recomendación
      rol: user.rol,
      fechaRegistro: new Date(),
      lecturas: [],
      foros: [],
      mensajes: [],
      eventos: [],
      inscripcions: [],
      recomendacions: []
    };
  }

  onSubmit() {
    if (this.recomendacionForm.valid && this.currentUser) {
      const libro: Libro = {
        id: 0,
        titulo: this.recomendacionForm.value.titulo,
        autor: this.recomendacionForm.value.autor,
        genero: this.recomendacionForm.value.genero,
        anioPublicacion: new Date().getFullYear(),
        sinopsis: this.recomendacionForm.value.descripcion,
        lecturas: [],
        recomendacions: []
      };

      this.submit.emit({
        usuario: this.convertUserToUsuario(this.currentUser),
        libro: libro,
        comentario: this.recomendacionForm.value.razonRecomendacion,
        fecha: new Date()
      });
    }
  }

  onCancel() {
    this.cancel.emit();
  }
} 