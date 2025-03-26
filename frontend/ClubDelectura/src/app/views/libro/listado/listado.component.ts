import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LibroService } from '../../../services/libro.service';
import { Libro } from '../../../models/libro.model';

@Component({
  selector: 'app-listado',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.css']
})
export class ListadoComponent implements OnInit {
  libros: Libro[] = [];
  generos: string[] = [];
  generoSeleccionado: string = '';

  constructor(private libroService: LibroService) {}

  ngOnInit(): void {
    this.loadBooks();
    this.loadGenres();
  }

  loadBooks(): void {
    this.libroService.getBooks().subscribe((libros: Libro[]) => {
      this.libros = libros;
    });
  }

  loadGenres(): void {
    this.libroService.getGenres().subscribe((generos: string[]) => {
      this.generos = generos;
    });
  }

  filterByGenre(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const genero = select.value;
    this.generoSeleccionado = genero;
    
    if (genero) {
      this.libroService.getBooksByGenre(genero).subscribe((libros: Libro[]) => {
        this.libros = libros;
      });
    } else {
      this.loadBooks();
    }
  }
}
