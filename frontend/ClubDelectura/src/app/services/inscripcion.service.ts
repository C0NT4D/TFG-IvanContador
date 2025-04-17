import { Injectable } from '@angular/core';
import { Observable, of, throwError, forkJoin } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
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
    return this.http.get<any[]>(`${this.apiUrl}/inscripciones`).pipe(
      switchMap(inscripciones => {
        if (inscripciones.length === 0) return of([]);
        
        // Crear un array de observables para obtener detalles de usuario y evento
        const inscripcionesCompletas = inscripciones.map(inscripcion => this.completarInscripcion(inscripcion));
        
        // Combinar todos los observables en uno solo
        return forkJoin(inscripcionesCompletas);
      }),
      catchError(this.handleError)
    );
  }

  getInscripcion(id: number): Observable<Inscripcion | undefined> {
    return this.http.get<any>(`${this.apiUrl}/inscripcion/${id}`).pipe(
      switchMap(inscripcion => this.completarInscripcion(inscripcion)),
      catchError(this.handleError)
    );
  }

  createInscripcion(inscripcionData: { evento_id: number, usuario_id: number }): Observable<Inscripcion> {
    return this.http.post<any>(`${this.apiUrl}/inscripcion`, {
      ...inscripcionData,
      fecha_inscripcion: new Date().toISOString()
    }).pipe(
      switchMap(inscripcion => {
        // Completar la inscripción con los datos del evento y usuario
        return this.completarInscripcion(inscripcion);
      }),
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
    // Obtener todas las inscripciones y filtrar
    return this.getInscripcions().pipe(
      map(inscripciones => inscripciones.filter(inscripcion => 
        inscripcion.evento.id === eventoId
      )),
      catchError(this.handleError)
    );
  }

  getInscripcionsByUsuario(usuarioId: number): Observable<Inscripcion[]> {
    // Obtener todas las inscripciones y filtrar
    return this.getInscripcions().pipe(
      map(inscripciones => inscripciones.filter(inscripcion => 
        inscripcion.usuario.id === usuarioId
      )),
      catchError(this.handleError)
    );
  }

  isUsuarioInscrito(eventoId: number, usuarioId: number): Observable<boolean> {
    // Obtener todas las inscripciones y comprobar
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

  // Método para completar los datos de una inscripción (evento y usuario)
  private completarInscripcion(inscripcion: any): Observable<Inscripcion> {
    // Obtener detalles del evento
    const evento$ = this.eventoService.getEvento(inscripcion.evento);
    // Obtener detalles del usuario
    const usuario$ = this.usuarioService.getUsuario(inscripcion.usuario);
    
    // Combinar ambos observables
    return forkJoin([evento$, usuario$]).pipe(
      map(([evento, usuario]) => {
        return {
          id: inscripcion.id,
          evento: evento || { id: inscripcion.evento, titulo: 'Evento no encontrado' } as Evento,
          usuario: usuario || { id: inscripcion.usuario, nombre: 'Usuario no encontrado' } as Usuario,
          fechaInscripcion: new Date(inscripcion.fechaInscripcion)
        } as Inscripcion;
      }),
      catchError(error => {
        console.error('Error al completar datos de inscripción:', error);
        // Devolver una inscripción con datos básicos si hay un error
        return of({
          id: inscripcion.id,
          evento: { id: inscripcion.evento, titulo: 'Error al cargar evento' } as Evento,
          usuario: { id: inscripcion.usuario, nombre: 'Error al cargar usuario' } as Usuario,
          fechaInscripcion: new Date(inscripcion.fechaInscripcion)
        } as Inscripcion);
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