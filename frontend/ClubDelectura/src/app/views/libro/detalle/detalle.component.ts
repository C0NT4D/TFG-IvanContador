import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LibroService } from '../../../services/libro.service';
import { LecturaService } from '../../../services/lectura.service'; // Importar LecturaService
import { Libro, Recomendacion } from '../../../models/libro.model'; // Lectura no se importa de aquí
import { Lectura } from '../../../models/lectura.model'; // Importar Lectura de su propio modelo
import { Usuario } from '../../../models/usuario.model';
import { AuthService } from '@app/services/auth.service';
import { Observable, of } from 'rxjs'; // Importar Observable y of
import { map, catchError } from 'rxjs/operators'; // Importar map y catchError

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink] // Asegúrate de añadir AsyncPipe si usas | async en plantilla
})
export class DetalleComponent implements OnInit {
  book?: Libro;
  loading = true;
  error = '';
  isUserLoggedIn = false;
  currentUserId: number | null = null;
  userHasReading$: Observable<boolean> = of(false); // Observable para controlar el botón

  constructor(
    private route: ActivatedRoute,
    private bookService: LibroService,
    private lecturaService: LecturaService, // Inyectar LecturaService
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    this.isUserLoggedIn = !!currentUser;
    this.currentUserId = currentUser?.id ?? null;

    this.route.params.subscribe(params => {
      const id = Number(params['id']);
      if (id && !isNaN(id)) {
        this.loadBook(id);
        // Solo comprobar estado de lectura si el usuario está logueado y tenemos ID de libro
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

  // Comprueba si el usuario actual tiene una lectura para este libro
  checkUserReadingStatus(bookId: number): void {
    if (this.currentUserId) {
      this.userHasReading$ = this.lecturaService.getLecturaByUsuarioAndLibro(
        this.currentUserId,
        bookId
      ).pipe(
        map(lectura => !!lectura), // Devuelve true si existe lectura, false si no
        catchError(err => { // Manejar error si el servicio falla
          console.error('Error checking reading status:', err);
          return of(false); // Asumir que no tiene lectura si hay error
        })
      );
    } else {
      this.userHasReading$ = of(false); // No logueado, no tiene lectura
    }
  }

  // Inicia una nueva lectura para el libro actual
  startReading(): void {
    // Comprobaciones iniciales
    if (!this.book || !this.isUserLoggedIn || !this.currentUserId) {
        this.error = 'Debes iniciar sesión para empezar a leer.';
        return;
    }
    // Re-obtener usuario por seguridad
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
        this.error = 'Error al obtener datos de usuario.';
        return;
    }

    this.error = ''; // Limpiar errores previos

    // Crear los datos para la nueva lectura
    const newReadingData: Omit<Lectura, 'id'> = {
      libro: this.book,
      usuario: currentUser,
      fechaInicio: new Date(),
      estadoLectura: 'EN_PROGRESS',
      fechaFin: null // Asignar null explícitamente
    };

    // Llamar al servicio para crear la lectura
    this.lecturaService.createLectura(newReadingData).subscribe({
      next: (createdReading) => {
        console.log('Lectura iniciada:', createdReading);
        // Actualizar el estado para ocultar el botón inmediatamente
        this.userHasReading$ = of(true);
        // Opcional: Podríamos querer actualizar la lista de lecturas mostrada en la página si la hubiera
        // this.loadBook(this.book!.id);
      },
      error: (err: Error | any) => {
        console.error('Error al iniciar la lectura:', err);
        // Mostrar el mensaje de error específico si existe (ej. "Ya tienes una lectura...")
        this.error = err?.message || 'Error desconocido al registrar la lectura.';
      }
    });
  }

  // Mantener el método addRecommendation por si se reutiliza
  addRecommendation(): void {
    console.warn('addRecommendation called, but button might be hidden.');
    // ... (código existente o lógica futura)
  }
}