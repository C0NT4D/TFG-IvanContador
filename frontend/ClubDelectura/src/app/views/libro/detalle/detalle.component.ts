import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LibroService } from '../../../services/libro.service';
import { Libro, Lectura, Recomendacion } from '../../../models/libro.model';
import { Usuario } from '../../../models/usuario.model';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class DetalleComponent implements OnInit {
  book?: Libro;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private bookService: LibroService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = Number(params['id']);
      this.loadBook(id);
    });
  }

  loadBook(id: number): void {
    this.loading = true;
    this.error = '';
    
    this.bookService.getBook(id).subscribe({
      next: (book) => {
        this.book = book;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los detalles del libro';
        this.loading = false;
      }
    });
  }

  addReading(): void {
    if (!this.book) return;
    
    const newReading: Lectura = {
      id: this.book.lecturas.length + 1,
      libro: this.book,
      usuario: {
        id: 1,
        nombre: 'Usuario Actual',
        email: 'usuario@ejemplo.com',
        contrasena: '',
        rol: 'USER',
        fechaRegistro: new Date(),
        lecturas: [],
        foros: [],
        mensajes: [],
        eventos: [],
        inscripcions: [],
        recomendacions: []
      },
      fechaInicio: new Date(),
      fechaFin: new Date(), // Inicialmente igual a fechaInicio
      estadoLectura: 'EN_PROGRESS'
    };

    this.bookService.addReading(this.book.id, newReading).subscribe({
      next: () => {
        this.loadBook(this.book!.id);
      },
      error: (err) => {
        this.error = 'Error al añadir la lectura';
      }
    });
  }

  addRecommendation(): void {
    if (!this.book) return;
    
    const newRecommendation: Recomendacion = {
      id: this.book.recomendacions.length + 1,
      libro: this.book,
      usuario: {
        id: 1,
        nombre: 'Usuario Actual',
        email: 'usuario@ejemplo.com',
        contrasena: '',
        rol: 'USER',
        fechaRegistro: new Date(),
        lecturas: [],
        foros: [],
        mensajes: [],
        eventos: [],
        inscripcions: [],
        recomendacions: []
      },
      comentario: '¡Gran libro!',
      fecha: new Date()
    };

    this.bookService.addRecommendation(this.book.id, newRecommendation).subscribe({
      next: () => {
        this.loadBook(this.book!.id);
      },
      error: (err) => {
        this.error = 'Error al añadir la recomendación';
      }
    });
  }
}
