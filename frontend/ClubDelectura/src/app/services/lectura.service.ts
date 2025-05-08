import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject, throwError, catchError } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Lectura } from '../models/lectura.model';
import { Usuario } from '../models/usuario.model';
import { Libro } from '../models/libro.model';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LecturaService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {}

  getLecturas(): Observable<Lectura[]> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return of([]);
    }
    return this.http.get<Lectura[]>(`${this.apiUrl}/lecturas?usuarioId=${currentUser.id}`);
  }

  getLectura(id: number): Observable<Lectura> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('Usuario no autenticado'));
    }
    return this.http.get<Lectura>(`${this.apiUrl}/lectura/${id}?usuarioId=${currentUser.id}`);
  }

  createLectura(lecturaData: { usuario: { id: number }, libro: { id: number }, estadoLectura: string, fechaInicio: string, fechaFin: string | null }): Observable<Lectura> {
    const data = {
      usuarioId: lecturaData.usuario.id,
      libroId: lecturaData.libro.id,
      estadoLectura: lecturaData.estadoLectura,
      fechaInicio: lecturaData.fechaInicio,
      fechaFin: lecturaData.fechaFin
    };

    return this.http.post<Lectura>(`${this.apiUrl}/lectura`, data).pipe(
      tap(lectura => {
        console.log('Lectura creada:', lectura);
        this.authService.addLecturaToCurrentUser(lectura);
      })
    );
  }

  updateLectura(id: number, lectura: Lectura): Observable<Lectura> {
    const usuarioId = typeof lectura.usuario === 'string' ? 
      this.authService.getCurrentUser()?.id || 1 : 
      lectura.usuario.id;
    
    const libroId = typeof lectura.libro === 'string' ? 
      (lectura.libro as string).split(' ')[0] ? parseInt((lectura.libro as string).split(' ')[0]) : 1 : 
      lectura.libro.id;

    const updateData = {
      usuarioId: usuarioId,
      libroId: libroId,
      estadoLectura: lectura.estadoLectura,
      fechaInicio: new Date(lectura.fechaInicio).toISOString().split('T')[0],
      fechaFin: lectura.fechaFin ? new Date(lectura.fechaFin).toISOString().split('T')[0] : null
    };

    console.log('Enviando datos de actualización:', updateData);
    return this.http.put<Lectura>(`${this.apiUrl}/lectura/${id}`, updateData);
  }

  deleteLectura(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/lectura/${id}`);
  }

  getLecturasByUsuario(usuarioId: number): Observable<Lectura[]> {
    return this.http.get<any[]>(`${this.apiUrl}/lecturas?usuarioId=${usuarioId}`).pipe(
      map(lecturas => {
        console.log('Todas las lecturas:', lecturas);
        const formattedLecturas = lecturas.map(lectura => ({
          id: lectura.id,
          estadoLectura: lectura.estadoLectura,
          fechaInicio: new Date(lectura.fechaInicio),
          fechaFin: lectura.fechaFin ? new Date(lectura.fechaFin) : null,
          usuario: {
            id: usuarioId,
            nombre: typeof lectura.usuario === 'string' ? lectura.usuario : lectura.usuario.nombre,
            email: '',
            contrasena: '',
            rol: 'USER',
            fechaRegistro: new Date(),
            lecturas: [],
            foros: [],
            mensajes: [],
            eventos: [],
            inscripcions: [],
            recomendacions: []
          },
          libro: {
            id: typeof lectura.libro === 'string' ? 0 : lectura.libro.id,
            titulo: typeof lectura.libro === 'string' ? lectura.libro : lectura.libro.titulo,
            autor: typeof lectura.libro === 'string' ? '' : lectura.libro.autor,
            genero: typeof lectura.libro === 'string' ? '' : lectura.libro.genero,
            anioPublicacion: typeof lectura.libro === 'string' ? 0 : lectura.libro.anioPublicacion,
            sinopsis: typeof lectura.libro === 'string' ? '' : lectura.libro.sinopsis,
            lecturas: [],
            recomendacions: []
          }
        }));
        console.log('Lecturas formateadas:', formattedLecturas);
        return formattedLecturas;
      })
    );
  }

  getLecturasByUsuarioAndStatus(usuarioId: number, status: string): Observable<Lectura[]> {
    return this.http.get<Lectura[]>(`${this.apiUrl}/lecturas`).pipe(
      map(lecturas => lecturas.filter(l => l.usuario.id === usuarioId && l.estadoLectura === status))
    );
  }

  getLecturaByUsuarioAndLibro(usuarioId: number, libroId: number): Observable<Lectura | undefined> {
    return this.http.get<Lectura[]>(`${this.apiUrl}/lecturas?usuarioId=${usuarioId}`).pipe(
      map(lecturas => lecturas.find(l => l.libro.id === libroId)),
      catchError(error => {
        console.error('Error al obtener la lectura:', error);
        return of(undefined);
      })
    );
  }
} 