import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject, throwError } from 'rxjs';
import { map, tap, find } from 'rxjs/operators';
import { Lectura } from '../models/lectura.model';
import { Usuario } from '../models/usuario.model';
import { Libro } from '../models/libro.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LecturaService {
  private lecturas: Lectura[] = [];
  private nextId = 1;

  constructor(private authService: AuthService) {}

  getLecturas(): Observable<Lectura[]> {
    return of(this.lecturas);
  }

  getLectura(id: number): Observable<Lectura> {
    const lectura = this.lecturas.find(l => l.id === id);
    if (lectura) {
      return of(lectura);
    }
    throw new Error('Lectura no encontrada');
  }

  createLectura(lecturaData: Omit<Lectura, 'id'>): Observable<Lectura> {
    const newLectura: Lectura = {
      ...lecturaData,
      id: this.nextId++,
      fechaInicio: typeof lecturaData.fechaInicio === 'string' ? new Date(lecturaData.fechaInicio) : lecturaData.fechaInicio,
      fechaFin: lecturaData.fechaFin ? (typeof lecturaData.fechaFin === 'string' ? new Date(lecturaData.fechaFin) : lecturaData.fechaFin) : null
    };

    const existe = this.lecturas.some(
      l => l.usuario.id === newLectura.usuario.id && l.libro.id === newLectura.libro.id
    );
    if (existe) {
      return throwError(() => new Error('Ya tienes una lectura registrada para este libro.'));
    }

    this.lecturas.push(newLectura);
    console.log('Lectura creada (mock):', newLectura);
    (this.authService as any).addLecturaToCurrentUser(newLectura);
    return of(newLectura);
  }

  updateLectura(id: number, lectura: Lectura): Observable<Lectura> {
    const index = this.lecturas.findIndex(l => l.id === id);
    if (index !== -1) {
      this.lecturas[index] = { ...lectura };
      return of(this.lecturas[index]);
    }
    throw new Error('Lectura no encontrada');
  }

  deleteLectura(id: number): Observable<void> {
    const index = this.lecturas.findIndex(l => l.id === id);
    if (index !== -1) {
      this.lecturas.splice(index, 1);
      return of(void 0);
    }
    throw new Error('Lectura no encontrada');
  }

  getLecturasByUsuario(usuarioId: number): Observable<Lectura[]> {
    const userLecturas = this.lecturas.filter(l => l.usuario.id === usuarioId);
    return of(userLecturas);
  }

  getLecturasByUsuarioAndStatus(usuarioId: number, status: string): Observable<Lectura[]> {
    return of(this.lecturas.filter(lectura => 
      lectura.usuario.id === usuarioId && 
      lectura.estadoLectura === status
    ));
  }

  getLecturaByUsuarioAndLibro(usuarioId: number, libroId: number): Observable<Lectura | undefined> {
    const lectura = this.lecturas.find(l => l.usuario.id === usuarioId && l.libro.id === libroId);
    return of(lectura);
  }
} 