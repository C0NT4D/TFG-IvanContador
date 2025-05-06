import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ForoService } from '../../../services/foro.service';
import { UsuarioService } from '../../../services/usuario.service';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { ErrorComponent } from '../../../components/error/error.component';

@Component({
  selector: 'app-forum-nuevo',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoadingComponent,
    ErrorComponent
  ],
  templateUrl: './nuevo.component.html',
  styleUrls: ['./nuevo.component.css']
})
export class NuevoComponent implements OnInit {
  foroForm: FormGroup;
  loading = false;
  error: string | null = null;
  currentUserId = 1;

  constructor(
    private fb: FormBuilder,
    private foroService: ForoService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    this.foroForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.foroForm.valid) {
      this.loading = true;
      this.error = null;

      this.usuarioService.getUsuario(this.currentUserId).subscribe({
        next: (usuario) => {
          if (usuario) {
            const foroData = {
              titulo: this.foroForm.value.titulo,
              descripcion: this.foroForm.value.descripcion,
              admin: usuario,
              mensajes: []
            };

            this.foroService.createForo(foroData).subscribe({
              next: (foro) => {
                this.loading = false;
                if (foro) {
                  this.router.navigate(['/foro']);
                } else {
                  this.error = 'Error al crear el foro';
                }
              },
              error: (error) => {
                this.loading = false;
                this.error = 'Error al crear el foro';
              }
            });
          } else {
            this.loading = false;
            this.error = 'No se pudo obtener la información del usuario';
          }
        },
        error: (error) => {
          this.loading = false;
          this.error = 'Error al obtener la información del usuario';
        }
      });
    } else {
      this.error = 'Por favor, complete todos los campos correctamente';
    }
  }

  cancelar(): void {
    this.router.navigate(['/foro']);
  }
} 