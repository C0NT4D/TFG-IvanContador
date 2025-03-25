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
    this.cargarLibros();
    this.cargarGeneros();
  }

  cargarLibros(): void {
    this.libroService.getLibros().subscribe(libros => {
      this.libros = libros;
    });
  }

  cargarGeneros(): void {
    this.libroService.getGeneros().subscribe(generos => {
      this.generos = generos;
    });
  }

  filtrarPorGenero(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const genero = select.value;
    this.generoSeleccionado = genero;
    
    if (genero) {
      this.libroService.getLibrosPorGenero(genero).subscribe(libros => {
        this.libros = libros;
      });
    } else {
      this.cargarLibros();
    }
  }
}
