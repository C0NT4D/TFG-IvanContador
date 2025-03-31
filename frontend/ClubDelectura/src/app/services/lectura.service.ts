import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Lectura } from '../models/lectura.model';
import { Usuario } from '../models/usuario.model';
import { Libro } from '../models/libro.model';

@Injectable({
  providedIn: 'root'
})
export class LecturaService {
  private lecturas: Lectura[] = [
    {
      id: 1,
      usuario: {
        id: 1,
        nombre: 'Juan Pérez',
        email: 'juan@example.com',
        contrasena: '123456',
        rol: 'usuario',
        fechaRegistro: new Date('2024-01-01')
      } as Usuario,
      libro: {
        id: 1,
        titulo: 'El Quijote',
        autor: 'Miguel de Cervantes',
        genero: 'Novela',
        anioPublicacion: 1605,
        sinopsis: 'La historia de un hidalgo que pierde la cordura...',
        lecturas: [],
        recomendacions: []
      } as Libro,
      estadoLectura: 'EN_PROGRESS',
      fechaInicio: new Date('2024-03-01'),
      fechaFin: null
    }
  ];

  constructor() {}

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

  createLectura(lectura: Omit<Lectura, 'id'>): Observable<Lectura> {
    const newLectura: Lectura = {
      ...lectura,
      id: this.lecturas.length + 1
    };
    this.lecturas.push(newLectura);
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
    return of(this.lecturas.filter(l => l.usuario.id === usuarioId));
  }

  getLecturasByUsuarioAndStatus(usuarioId: number, status: string): Observable<Lectura[]> {
    return of(this.lecturas.filter(lectura => 
      lectura.usuario.id === usuarioId && 
      lectura.estadoLectura === status
    ));
  }
} 