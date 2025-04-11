import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LibroService } from '../../../services/libro.service';
import { Libro, Lectura, Recomendacion } from '../../../models/libro.model';
import { Usuario } from '../../../models/usuario.model';
import { AuthService } from '@app/services/auth.service';

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
    private bookService: LibroService,
    private authService: AuthService 
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
    const currentUser = this.authService.getCurrentUser(); // Obtener usuario actual
    if (!this.book || !currentUser) { // Comprobar libro Y usuario
        if(!currentUser) {
            this.error = 'Debes iniciar sesión para empezar a leer.';
        }
        return;
    }

    // Crear objeto Lectura completo con id temporal y usuario actual
    const newReading: Lectura = {
      id: 0, // ID temporal, el servicio debería asignarlo
      libro: this.book,
      usuario: currentUser, // Usar el usuario actual
      fechaInicio: new Date(),
      fechaFin: undefined, // Válido porque fechaFin es opcional en el modelo
      estadoLectura: 'EN_PROGRESS'
    };

    // Llamar al servicio con el objeto Lectura completo
    this.bookService.addReading(this.book.id, newReading).subscribe({
      next: (createdReading) => { // Parámetro puede ser útil
        this.loadBook(this.book!.id);
        this.error = '';
      },
      error: (err: Error | any) => {
        console.error('Error al añadir la lectura:', err);
        this.error = err?.message || 'Error al registrar la lectura.';
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
