import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LibroService } from '../../../services/libro.service';
import { Libro } from '../../../models/libro.model';
import { BookCardComponent } from '../../../components/book-card/book-card.component';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { ErrorComponent } from '../../../components/error/error.component';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ConfirmModalComponent } from '../../../components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-listado',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    BookCardComponent, 
    LoadingComponent, 
    ErrorComponent,
    ReactiveFormsModule,
    ConfirmModalComponent
  ],
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.css']
})
export class ListadoComponent implements OnInit {
  libros: Libro[] = [];
  generos: string[] = [];
  generoSeleccionado: string = '';
  error: string = '';
  loading = true;
  isAdmin = false;
  showAddForm = false;
  showDeleteModal = false;
  libroToDelete: number | null = null;
  libroForm: FormGroup;

  constructor(
    private libroService: LibroService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.libroForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      autor: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadBooks();
    this.loadGenres();
    this.checkAdminStatus();
  }

  loadBooks(): void {
    this.libroService.getBooks().subscribe({
      next: (libros: Libro[]) => {
        this.libros = libros;
        this.loading = false;
      },
      error: (error: Error) => {
        this.error = 'Error al cargar los libros';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  loadGenres(): void {
    this.libroService.getGenres().subscribe({
      next: (generos: string[]) => {
        this.generos = generos;
      },
      error: (error: Error) => {
        console.error('Error al cargar géneros:', error);
      }
    });
  }

  filterByGenre(genero: string): void {
    this.generoSeleccionado = genero;
    if (genero === '') {
      this.loadBooks();
    } else {
      this.libroService.getBooksByGenre(genero).subscribe({
        next: (libros: Libro[]) => {
          this.libros = libros;
        },
        error: (error: Error) => {
          this.error = 'Error al filtrar los libros';
          console.error('Error:', error);
        }
      });
    }
  }

  openAddBook(): void {
    this.showAddForm = true;
  }

  onCancel(): void {
    this.showAddForm = false;
    this.libroForm.reset();
  }

  onSubmit(): void {
    if (this.libroForm.valid) {
      const libroData = this.libroForm.value;
      this.libroService.createBook(libroData).subscribe({
        next: () => {
          this.loadBooks();
          this.showAddForm = false;
          this.libroForm.reset();
        },
        error: (error: Error) => {
          console.error('Error al crear el libro:', error);
        }
      });
    }
  }

  onDeleteLibro(id: number): void {
    this.libroToDelete = id;
    this.showDeleteModal = true;
  }

  onConfirmDelete(): void {
    if (this.libroToDelete) {
      this.libroService.deleteBook(this.libroToDelete).subscribe({
        next: () => {
          this.loadBooks();
          this.showDeleteModal = false;
          this.libroToDelete = null;
        },
        error: (error: Error) => {
          console.error('Error al eliminar el libro:', error);
          this.showDeleteModal = false;
          this.libroToDelete = null;
        }
      });
    }
  }

  onCancelDelete(): void {
    this.showDeleteModal = false;
    this.libroToDelete = null;
  }

  private checkAdminStatus() {
    this.isAdmin = this.authService.isAdmin();
  }
}
