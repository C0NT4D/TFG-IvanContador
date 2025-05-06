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
        
        const inscripcionesCompletas = inscripciones.map(inscripcion => this.completarInscripcion(inscripcion));
        
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
    return this.getInscripcions().pipe(
      map(inscripciones => inscripciones.filter(inscripcion => 
        inscripcion.evento.id === eventoId
      )),
      catchError(this.handleError)
    );
  }

  getInscripcionsByUsuario(usuarioId: number): Observable<Inscripcion[]> {
    return this.getInscripcions().pipe(
      map(inscripciones => inscripciones.filter(inscripcion => 
        inscripcion.usuario.id === usuarioId
      )),
      catchError(this.handleError)
    );
  }

  isUsuarioInscrito(eventoId: number, usuarioId: number): Observable<boolean> {
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

  private completarInscripcion(inscripcion: any): Observable<Inscripcion> {
    const evento$ = this.eventoService.getEvento(inscripcion.evento);
    const usuario$ = this.usuarioService.getUsuario(inscripcion.usuario);
    
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
        return of({
          id: inscripcion.id,
          evento: { id: inscripcion.evento, titulo: 'Error al cargar evento' } as Evento,
          usuario: { id: inscripcion.usuario, nombre: 'Error al cargar usuario' } as Usuario,
          fechaInscripcion: new Date(inscripcion.fechaInscripcion)
        } as Inscripcion);
      })
    );
  }
  
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código de error: ${error.status}, mensaje: ${error.error?.message || error.statusText}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
} 