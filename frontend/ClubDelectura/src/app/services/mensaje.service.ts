import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Mensaje } from '../models/mensaje.model';
import { Foro } from '../models/foro.model';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class MensajeService {
  private apiUrl = '/api';

  constructor(
    private http: HttpClient
  ) { }

  getMensajes(): Observable<Mensaje[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mensajes`).pipe(
      map(mensajes => {
        return mensajes.map(mensaje => {
          return this.procesarMensajeResponse(mensaje);
        });
      }),
      catchError(this.handleError)
    );
  }

  getMensaje(id: number): Observable<Mensaje | undefined> {
    return this.http.get<any>(`${this.apiUrl}/mensaje/${id}`).pipe(
      map(mensaje => this.procesarMensajeResponse(mensaje)),
      catchError(this.handleError)
    );
  }

  getMensajesByForo(foroId: number): Observable<Mensaje[]> {
    return this.getMensajes().pipe(
      map(mensajes => mensajes.filter(mensaje => mensaje.foro.id === foroId)),
      catchError(this.handleError)
    );
  }

  createMensaje(mensaje: { foroId: number, usuarioId: number, contenido: string }): Observable<Mensaje> {
    return this.http.post<any>(`${this.apiUrl}/mensaje`, mensaje).pipe(
      map(response => this.procesarMensajeResponse(response)),
      catchError(this.handleError)
    );
  }

  updateMensaje(id: number, mensaje: Partial<Mensaje>): Observable<Mensaje | undefined> {
    const backendData = {
      foroId: mensaje.foro?.id,
      usuarioId: mensaje.usuario?.id,
      contenido: mensaje.contenido
    };
    
    return this.http.put<any>(`${this.apiUrl}/mensaje/${id}`, backendData).pipe(
      map(response => this.procesarMensajeResponse(response)),
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
    return this.getMensajes().pipe(
      map(mensajes => mensajes.filter(mensaje => mensaje.usuario.id === usuarioId)),
      catchError(this.handleError)
    );
  }
  
  private procesarMensajeResponse(response: any): Mensaje {
    return {
      id: response.id,
      foro: {
        id: response.foro.id,
        titulo: response.foro.titulo,
        descripcion: '',
        fechaCreacion: new Date(),
        admin: {} as Usuario,
        mensajes: [],
        temas: []
      } as Foro,
      usuario: {
        id: response.usuario.id,
        nombre: response.usuario.nombre,
        email: '',
        contrasena: '',
        rol: '',
        fechaRegistro: new Date(),
        lecturas: [],
        foros: [],
        mensajes: [],
        eventos: [],
        inscripcions: [],
        recomendacions: []
      } as Usuario,
      contenido: response.contenido,
      fechaEnvio: new Date(response.fechaEnvio)
    };
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