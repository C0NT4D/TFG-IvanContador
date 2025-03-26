import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LibroService } from '../../../services/libro.service';
import { Libro } from '../../../models/libro.model';
import { BookCardComponent } from '../../../components/book-card/book-card.component';

@Component({
  selector: 'app-listado',
  standalone: true,
  imports: [CommonModule, RouterModule, BookCardComponent],
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.css']
})
export class ListadoComponent implements OnInit {
  libros: Libro[] = [];
  generos: string[] = [];
  generoSeleccionado: string = '';
  error: string = '';

  constructor(private libroService: LibroService) {}

  ngOnInit(): void {
    this.loadBooks();
    this.loadGenres();
  }

  loadBooks(): void {
    this.libroService.getBooks().subscribe({
      next: (libros: Libro[]) => {
        this.libros = libros;
      },
      error: (error: Error) => {
        this.error = 'Error al cargar los libros';
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
}
