import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Recomendacion } from '../models/recomendacion.model';

@Injectable({
  providedIn: 'root'
})
export class RecomendacionService {
  // URL relativa para el proxy
  private apiUrl = '/api';

  constructor(private http: HttpClient) { }

  getRecomendaciones(): Observable<Recomendacion[]> {
    return this.http.get<Recomendacion[]>(`${this.apiUrl}/recomendaciones`).pipe(
      catchError(this.handleError)
    );
  }

  getRecomendacion(id: number): Observable<Recomendacion> {
    return this.http.get<Recomendacion>(`${this.apiUrl}/recomendacion/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createRecomendacion(recomendacion: { usuarioId: number, libroId: number, comentario: string }): Observable<Recomendacion> {
    return this.http.post<Recomendacion>(`${this.apiUrl}/recomendacion`, recomendacion).pipe(
      catchError(this.handleError)
    );
  }

  updateRecomendacion(id: number, recomendacion: Partial<Recomendacion>): Observable<Recomendacion> {
    return this.http.put<Recomendacion>(`${this.apiUrl}/recomendacion/${id}`, recomendacion).pipe(
      catchError(this.handleError)
    );
  }

  deleteRecomendacion(id: number): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/recomendacion/${id}`).pipe(
      map(() => true),
      catchError(error => {
        this.handleError(error);
        return of(false);
      })
    );
  }

  getRecomendacionesByLibro(libroId: number): Observable<Recomendacion[]> {
    // Si no hay un endpoint específico, filtramos del getAll
    return this.getRecomendaciones().pipe(
      map(recomendaciones => recomendaciones.filter(r => r.libro.id === libroId)),
      catchError(this.handleError)
    );
  }

  getRecomendacionesByUsuario(usuarioId: number): Observable<Recomendacion[]> {
    // Si no hay un endpoint específico, filtramos del getAll
    return this.getRecomendaciones().pipe(
      map(recomendaciones => recomendaciones.filter(r => r.usuario.id === usuarioId)),
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