import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Foro } from '../models/foro.model';

@Injectable({
  providedIn: 'root'
})
export class ForoService {
  // URL relativa para el proxy
  private apiUrl = '/api';

  constructor(private http: HttpClient) { }

  getForos(): Observable<Foro[]> {
    return this.http.get<Foro[]>(`${this.apiUrl}/foros`).pipe(
      catchError(this.handleError)
    );
  }

  getForo(id: number): Observable<Foro | undefined> {
    return this.http.get<Foro>(`${this.apiUrl}/foro/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createForo(foro: Omit<Foro, 'id' | 'fechaCreacion'>): Observable<Foro> {
    return this.http.post<Foro>(`${this.apiUrl}/foro`, {
      titulo: foro.titulo,
      descripcion: foro.descripcion,
      fecha_creacion: new Date().toISOString(),
      admin_id: foro.admin.id
    }).pipe(
      catchError(this.handleError)
    );
  }

  updateForo(id: number, foro: Partial<Foro>): Observable<Foro | undefined> {
    return this.http.put<Foro>(`${this.apiUrl}/foro/${id}`, foro).pipe(
      catchError(this.handleError)
    );
  }

  deleteForo(id: number): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/foro/${id}`).pipe(
      map(() => true),
      catchError(error => {
        this.handleError(error);
        return of(false);
      })
    );
  }

  getForosByAdmin(adminId: number): Observable<Foro[]> {
    // Si no hay un endpoint específico, filtramos del getAll
    return this.getForos().pipe(
      map(foros => foros.filter(foro => foro.admin.id === adminId)),
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