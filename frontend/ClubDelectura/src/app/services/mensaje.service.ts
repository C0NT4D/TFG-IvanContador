import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Mensaje } from '../models/mensaje.model';
import { ForoService } from './foro.service';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class MensajeService {
  // URL relativa para el proxy
  private apiUrl = '/api';

  constructor(
    private http: HttpClient,
    private foroService: ForoService,
    private usuarioService: UsuarioService
  ) { }

  getMensajes(): Observable<Mensaje[]> {
    return this.http.get<Mensaje[]>(`${this.apiUrl}/mensajes`).pipe(
      catchError(this.handleError)
    );
  }

  getMensaje(id: number): Observable<Mensaje | undefined> {
    return this.http.get<Mensaje>(`${this.apiUrl}/mensaje/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getMensajesByForo(foroId: number): Observable<Mensaje[]> {
    // Si no hay un endpoint específico, filtramos del getAll
    return this.getMensajes().pipe(
      map(mensajes => mensajes.filter(mensaje => mensaje.foro.id === foroId)),
      catchError(this.handleError)
    );
  }

  createMensaje(mensaje: { foroId: number, usuarioId: number, contenido: string }): Observable<Mensaje> {
    return this.http.post<Mensaje>(`${this.apiUrl}/mensaje`, mensaje).pipe(
      catchError(this.handleError)
    );
  }

  updateMensaje(id: number, mensaje: Partial<Mensaje>): Observable<Mensaje | undefined> {
    return this.http.put<Mensaje>(`${this.apiUrl}/mensaje/${id}`, mensaje).pipe(
      catchError(this.handleError)
    );
  }

  deleteMensaje(id: number): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/mensaje/${id}`).pipe(
      map(() => true),
      catchError(error => {
        this.handleError(error);
        return of(false);
      })
    );
  }

  getMensajesByUsuario(usuarioId: number): Observable<Mensaje[]> {
    // Si no hay un endpoint específico, filtramos del getAll
    return this.getMensajes().pipe(
      map(mensajes => mensajes.filter(mensaje => mensaje.usuario.id === usuarioId)),
      catchError(this.handleError)
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