import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Recomendacion } from '../models/recomendacion.model';
import { UsuarioService } from './usuario.service';
import { LibroService } from './libro.service';

@Injectable({
  providedIn: 'root'
})
export class RecomendacionService {
  private apiUrl = '/api';

  constructor(
    private http: HttpClient,
    private usuarioService: UsuarioService,
    private libroService: LibroService
  ) { }

  // Obtener todas las recomendaciones
  getRecomendaciones(): Observable<Recomendacion[]> {
    return this.http.get<any[]>(`${this.apiUrl}/recomendaciones`)
      .pipe(
        map(data => {
          return data.map(item => {
            return {
              id: item.id,
              usuario: {
                id: item.usuario.id,
                nombre: item.usuario.nombre
              },
              libro: {
                id: item.libro.id,
                titulo: item.libro.titulo
              },
              comentario: item.comentario,
              fecha: new Date(item.fecha)
            } as Recomendacion;
          });
        }),
        catchError(this.handleError)
      );
  }

  // Obtener una recomendación por id
  getRecomendacion(id: number): Observable<Recomendacion> {
    return this.http.get<any>(`${this.apiUrl}/recomendacion/${id}`)
      .pipe(
        map(data => {
          return {
            id: data.id,
            usuario: {
              id: data.usuario.id,
              nombre: data.usuario.nombre
            },
            libro: {
              id: data.libro.id,
              titulo: data.libro.titulo
            },
            comentario: data.comentario,
            fecha: new Date(data.fecha)
          } as Recomendacion;
        }),
        catchError(this.handleError)
      );
  }

  // Crear una recomendación
  createRecomendacion(recomendacion: { usuarioId: number, libroId: number, comentario: string }): Observable<Recomendacion> {
    return this.http.post<any>(`${this.apiUrl}/recomendacion`, recomendacion)
      .pipe(
        map(response => {
          return {
            id: response.id,
            usuario: {
              id: response.usuario.id,
              nombre: response.usuario.nombre
            },
            libro: {
              id: response.libro.id,
              titulo: response.libro.titulo
            },
            comentario: response.comentario,
            fecha: new Date(response.fecha)
          } as Recomendacion;
        }),
        catchError(this.handleError)
      );
  }

  // Actualizar una recomendación
  updateRecomendacion(recomendacion: Recomendacion): Observable<Recomendacion> {
    const data = {
      usuarioId: recomendacion.usuario.id,
      libroId: recomendacion.libro.id,
      comentario: recomendacion.comentario
    };

    return this.http.put<any>(`${this.apiUrl}/recomendacion/${recomendacion.id}`, data)
      .pipe(
        map(response => {
          return {
            id: response.id,
            usuario: {
              id: response.usuario.id,
              nombre: response.usuario.nombre
            },
            libro: {
              id: response.libro.id,
              titulo: response.libro.titulo
            },
            comentario: response.comentario,
            fecha: new Date(response.fecha)
          } as Recomendacion;
        }),
        catchError(this.handleError)
      );
  }

  // Eliminar una recomendación
  deleteRecomendacion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/recomendacion/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ha ocurrido un error desconocido';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código de error: ${error.status}, mensaje: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
} 