import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Evento } from '../models/evento.model';
import { Usuario } from '../models/usuario.model'; 
import { Inscripcion } from '../models/inscripcion.model';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  // URL relativa para el proxy
  private apiUrl = '/api';

  constructor(private http: HttpClient) { }

  getEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.apiUrl}/eventos`).pipe(
      catchError(this.handleError)
    );
  }

  getEvento(id: number): Observable<Evento | undefined> {
    return this.http.get<Evento>(`${this.apiUrl}/evento/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createEvento(eventoData: Omit<Evento, 'id' | 'inscripcions'>): Observable<Evento> {
    return this.http.post<Evento>(`${this.apiUrl}/evento`, eventoData).pipe(
      catchError(this.handleError)
    );
  }

  updateEvento(id: number, eventoUpdate: Partial<Omit<Evento, 'id'>>): Observable<Evento | undefined> {
    return this.http.put<Evento>(`${this.apiUrl}/evento/${id}`, eventoUpdate).pipe(
      catchError(this.handleError)
    );
  }

  deleteEvento(id: number): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/evento/${id}`).pipe(
      map(() => true),
      catchError(error => {
        this.handleError(error);
        return of(false);
      })
    );
  }

  getEventosByOrganizador(organizadorId: number): Observable<Evento[]> {
    // Si no hay un endpoint específico, filtramos del getAll
    return this.getEventos().pipe(
      map(eventos => eventos.filter(evento => evento.organizador?.id === organizadorId)),
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