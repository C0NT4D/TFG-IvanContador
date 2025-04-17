import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Usuario } from '@app/models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  // URL relativa para el proxy
  private apiUrl = '/api';

  constructor(private http: HttpClient) { }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/usuarios`).pipe(
      catchError(this.handleError)
    );
  }

  getUsuario(id: number): Observable<Usuario | undefined> {
    return this.http.get<Usuario>(`${this.apiUrl}/usuario/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createUsuario(userData: { nombre: string; email: string; contrasena: string }): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/usuario`, {
      ...userData,
      rol: 'user'
    }).pipe(
      catchError(this.handleError)
    );
  }

  updateUsuario(id: number, usuario: Partial<Usuario>): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/usuario/${id}`, usuario).pipe(
      catchError(this.handleError)
    );
  }

  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/usuario/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  login(email: string, contrasena: string): Observable<Usuario | null> {
    return this.http.post<Usuario>(`${this.apiUrl}/login`, { 
      email, 
      password: contrasena 
    }).pipe(
      catchError(error => {
        console.error('Error de login:', error);
        return of(null);
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