import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inscripcion } from '../models/inscripcion.model';
import { Evento } from '../models/evento.model';
import { Usuario } from '../models/usuario.model';
import { EventoService } from './evento.service';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class InscripcionService {
  // URL relativa para el proxy
  private apiUrl = '/api';

  constructor(
    private http: HttpClient,
    private eventoService: EventoService,
    private usuarioService: UsuarioService
  ) { }

  getInscripcions(): Observable<Inscripcion[]> {
    return this.http.get<Inscripcion[]>(`${this.apiUrl}/inscripciones`).pipe(
      catchError(this.handleError)
    );
  }

  getInscripcion(id: number): Observable<Inscripcion | undefined> {
    return this.http.get<Inscripcion>(`${this.apiUrl}/inscripcion/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createInscripcion(inscripcionData: { evento_id: number, usuario_id: number }): Observable<Inscripcion> {
    return this.http.post<Inscripcion>(`${this.apiUrl}/inscripcion`, {
      ...inscripcionData,
      fecha_inscripcion: new Date().toISOString()
    }).pipe(
      catchError(this.handleError)
    );
  }

  deleteInscripcion(id: number): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/inscripcion/${id}`).pipe(
      map(() => true),
      catchError(error => {
        this.handleError(error);
        return of(false);
      })
    );
  }

  getInscripcionsByEvento(eventoId: number): Observable<Inscripcion[]> {
    // Si no hay un endpoint específico, filtramos del getAll
    return this.getInscripcions().pipe(
      map(inscripciones => inscripciones.filter(inscripcion => 
        inscripcion.evento.id === eventoId
      )),
      catchError(this.handleError)
    );
  }

  getInscripcionsByUsuario(usuarioId: number): Observable<Inscripcion[]> {
    // Si no hay un endpoint específico, filtramos del getAll
    return this.getInscripcions().pipe(
      map(inscripciones => inscripciones.filter(inscripcion => 
        inscripcion.usuario.id === usuarioId
      )),
      catchError(this.handleError)
    );
  }

  isUsuarioInscrito(eventoId: number, usuarioId: number): Observable<boolean> {
    // Si no hay un endpoint específico, filtramos del getAll
    return this.getInscripcions().pipe(
      map(inscripciones => inscripciones.some(inscripcion => 
        inscripcion.evento.id === eventoId && inscripcion.usuario.id === usuarioId
      )),
      catchError(error => {
        this.handleError(error);
        return of(false);
      })
    );
  }
  
  // Manejador de errores genérico
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código de error: ${error.status}, mensaje: ${error.error?.message || error.statusText}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
} 