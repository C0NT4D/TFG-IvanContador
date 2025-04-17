import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RecomendacionService } from '@app/services/recomendacion.service';
import { AuthService } from '@app/services/auth.service';
import { ConfirmModalComponent } from '@app/components/confirm-modal/confirm-modal.component';
import { Recomendacion } from '@app/models/recomendacion.model';
import { LibroService } from '@app/services/libro.service';
import { Libro } from '@app/models/libro.model';
import { Usuario } from '@app/models/usuario.model';

@Component({
  selector: 'app-listado',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ConfirmModalComponent
  ],
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.css']
})
export class ListadoComponent implements OnInit {
  recomendaciones: Recomendacion[] = [];
  recomendacionForm: FormGroup;
  librosDisponibles: Libro[] = [];
  loading = true;
  error: string | null = null;
  showAddForm = false;
  isAdmin = false;
  currentUserId: number | null = null;
  showDeleteModal = false;
  recomendacionToDelete: number | null = null;

  constructor(
    private fb: FormBuilder,
    private recomendacionService: RecomendacionService,
    private libroService: LibroService,
    private authService: AuthService
  ) {
    this.recomendacionForm = this.fb.group({
      libroId: ['', Validators.required],
      comentario: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.loadRecomendaciones();
    this.loadLibrosDisponibles();
    this.isAdmin = this.authService.isAdmin();
    const currentUser = this.authService.getCurrentUser();
    this.currentUserId = currentUser?.id ?? null;
  }

  private loadRecomendaciones(): void {
    this.loading = true;
    this.error = null;
    this.recomendacionService.getRecomendaciones().subscribe({
      next: (recomendaciones: Recomendacion[]) => {
        this.recomendaciones = recomendaciones;
        console.log('Recomendaciones cargadas:', this.recomendaciones);
        this.loading = false;
      },
      error: (err: Error) => {
        this.error = 'Error al cargar las recomendaciones';
        this.loading = false;
        console.error('Error loading recommendations:', err);
      }
    });
  }

  private loadLibrosDisponibles(): void {
    this.libroService.getBooks().subscribe({
      next: (libros: Libro[]) => {
        this.librosDisponibles = libros;
      },
      error: (err: Error) => {
        console.error('Error al cargar los libros para el formulario:', err);
      }
    });
  }

  openAddRecomendacion(): void {
    this.showAddForm = true;
  }

  onCancel(): void {
    this.showAddForm = false;
    this.recomendacionForm.reset();
  }

  onSubmit(): void {
    if (this.recomendacionForm.invalid) {
      this.recomendacionForm.markAllAsTouched();
      return;
    }
    
    const currentUser: Usuario | null = this.authService.getCurrentUser();
    const selectedLibroId = Number(this.recomendacionForm.value.libroId);
    const selectedLibro: Libro | undefined = this.librosDisponibles.find(libro => libro.id === selectedLibroId);

    if (!currentUser) {
      this.error = "No se pudo identificar al usuario.";
      return;
    }
    if (!selectedLibro) {
      this.error = "Libro seleccionado no encontrado.";
      this.recomendacionForm.get('libroId')?.setValue('');
      return;
    }

    const recomendacionParaEnviar = {
      usuarioId: currentUser.id,
      libroId: selectedLibro.id,
      comentario: this.recomendacionForm.value.comentario
    };

    this.recomendacionService.createRecomendacion(recomendacionParaEnviar).subscribe({
      next: () => {
        this.loadRecomendaciones();
        this.showAddForm = false;
        this.recomendacionForm.reset();
      },
      error: (err: Error) => {
        console.error('Error al crear la recomendación:', err);
        this.error = 'Error al guardar la recomendación.';
      }
    });
  }

  onDeleteRecomendacion(id: number): void {
    this.recomendacionToDelete = id;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (this.recomendacionToDelete !== null) {
      const idToDelete = this.recomendacionToDelete;
      this.recomendacionService.deleteRecomendacion(idToDelete).subscribe({
        next: () => {
          this.recomendaciones = this.recomendaciones.filter(r => r.id !== idToDelete);
          this.cancelDelete();
        },
        error: (err: Error) => {
          console.error('Error al eliminar la recomendación:', err);
          this.error = 'Error al eliminar la recomendación.';
          this.cancelDelete();
        }
      });
    }
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.recomendacionToDelete = null;
  }
}
