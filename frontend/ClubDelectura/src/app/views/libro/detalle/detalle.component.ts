import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LibroService } from '../../../services/libro.service';
import { LecturaService } from '../../../services/lectura.service';
import { Libro } from '../../../models/libro.model';
import { Recomendacion } from '../../../models/recomendacion.model';
import { Lectura } from '../../../models/lectura.model';
import { Usuario } from '../../../models/usuario.model';
import { AuthService } from '@app/services/auth.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

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
  isUserLoggedIn = false;
  currentUserId: number | null = null;
  userHasReading$: Observable<boolean> = of(false);

  constructor(
    private route: ActivatedRoute,
    private bookService: LibroService,
    private lecturaService: LecturaService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    this.isUserLoggedIn = !!currentUser;
    this.currentUserId = currentUser?.id ?? null;
    console.log('LibroDetalle: ngOnInit - Usuario actual:', currentUser);
    console.log('LibroDetalle: ngOnInit - isUserLoggedIn:', this.isUserLoggedIn, 'currentUserId:', this.currentUserId);

    this.route.params.subscribe(params => {
      const id = Number(params['id']);
      if (id && !isNaN(id)) {
        this.loadBook(id);
        if (this.isUserLoggedIn) {
          this.checkUserReadingStatus(id);
        }
      } else {
        this.error = "ID de libro inválido.";
        this.loading = false;
      }
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
        console.error('Error loading book details:', err);
        this.error = 'Error al cargar los detalles del libro';
        this.loading = false;
      }
    });
  }

  checkUserReadingStatus(bookId: number): void {
    if (this.currentUserId) {
      this.userHasReading$ = this.lecturaService.getLecturaByUsuarioAndLibro(
        this.currentUserId,
        bookId
      ).pipe(
        map(lectura => !!lectura),
        catchError(err => {
          console.error('Error checking reading status:', err);
          return of(false);
        })
      );
    } else {
      this.userHasReading$ = of(false);
    }
  }

  startReading(): void {
    const userCheck = this.authService.getCurrentUser();
    console.log('LibroDetalle: Intentando iniciar lectura. Usuario actual (check directo):', userCheck);
    console.log('LibroDetalle: Propiedades al inicio de startReading - isUserLoggedIn:', this.isUserLoggedIn, 'currentUserId:', this.currentUserId);

    if (!this.book || !this.isUserLoggedIn || !this.currentUserId) {
        this.error = 'Debes iniciar sesión para empezar a leer.';
        console.error('Error startReading: Comprobación inicial fallida.', { book: !!this.book, isUserLoggedIn: this.isUserLoggedIn, currentUserId: this.currentUserId });
        return;
    }
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
        this.error = 'Error al obtener datos de usuario.';
        console.error('Error startReading: Falló el segundo check de currentUser.');
        return;
    }

    this.error = '';

    const newReadingData: Omit<Lectura, 'id'> = {
      libro: this.book,
      usuario: currentUser,
      fechaInicio: new Date(),
      estadoLectura: 'EN_PROGRESS',
      fechaFin: null
    };

    this.lecturaService.createLectura(newReadingData).subscribe({
      next: (createdReading) => {
        console.log('Lectura iniciada:', createdReading);
        this.userHasReading$ = of(true);
      },
      error: (err: Error | any) => {
        console.error('Error al iniciar la lectura:', err);
        this.error = err?.message || 'Error desconocido al registrar la lectura.';
      }
    });
  }

  addRecommendation(): void {
    console.warn('addRecommendation called, but button might be hidden.');
  }
}