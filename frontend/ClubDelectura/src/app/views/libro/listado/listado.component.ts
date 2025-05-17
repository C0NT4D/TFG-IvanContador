import { Component, OnInit, HostListener } from '@angular/core';
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
  isDropdownOpen = false;
  currentFocusIndex = -1;

  constructor(
    private libroService: LibroService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.libroForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      autor: ['', Validators.required],
      genero: ['', Validators.required],
      anioPublicacion: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      sinopsis: ['', Validators.required]
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const dropdown = document.querySelector('.dropdown');
    const dropdownButton = document.querySelector('.dropdown-toggle');
    
    if (dropdown && !dropdown.contains(event.target as Node) && 
        dropdownButton && !dropdownButton.contains(event.target as Node)) {
      this.closeDropdown();
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.isDropdownOpen) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.currentFocusIndex = Math.min(this.currentFocusIndex + 1, this.generos.length - 1);
        this.focusDropdownItem();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.currentFocusIndex = Math.max(this.currentFocusIndex - 1, 0);
        this.focusDropdownItem();
        break;
      case 'Enter':
      case ' ':
        if (this.currentFocusIndex >= 0) {
          event.preventDefault();
          this.filterByGenre(this.generos[this.currentFocusIndex]);
          this.closeDropdown();
        }
        break;
      case 'Escape':
        this.closeDropdown();
        break;
    }
  }

  private focusDropdownItem(): void {
    const items = document.querySelectorAll('.dropdown-item');
    if (items[this.currentFocusIndex]) {
      (items[this.currentFocusIndex] as HTMLElement).focus();
    }
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
    if (this.isDropdownOpen) {
      this.currentFocusIndex = -1;
      setTimeout(() => {
        const firstItem = document.querySelector('.dropdown-item') as HTMLElement;
        if (firstItem) firstItem.focus();
      });
    }
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
    this.currentFocusIndex = -1;
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
