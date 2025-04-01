import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Recomendacion } from '../models/recomendacion.model';

@Injectable({
  providedIn: 'root'
})
export class RecomendacionService {
  private recomendaciones: Recomendacion[] = [
    {
      id: 1,
      usuario: {
        id: 1,
        nombre: 'Juan Pérez',
        email: 'juan@example.com',
        contrasena: '123456',
        rol: 'usuario',
        fechaRegistro: new Date('2024-01-01'),
        lecturas: [],
        foros: [],
        mensajes: [],
        eventos: [],
        recomendacions: [],
        inscripcions: []
      },
      libro: {
        id: 1,
        titulo: 'El Quijote',
        autor: 'Miguel de Cervantes',
        genero: 'Novela',
        anioPublicacion: 1605,
        sinopsis: 'La historia de un hidalgo que pierde la cordura...',
        lecturas: [],
        recomendacions: []
      },
      comentario: '¡Un clásico imprescindible! La forma en que Cervantes juega con la realidad y la ficción es magistral.',
      fecha: new Date('2024-03-15')
    }
  ];

  constructor() { }

  getRecomendaciones(): Observable<Recomendacion[]> {
    return of(this.recomendaciones);
  }

  getRecomendacion(id: number): Observable<Recomendacion> {
    const recomendacion = this.recomendaciones.find(r => r.id === id);
    if (recomendacion) {
      return of(recomendacion);
    }
    throw new Error('Recomendación no encontrada');
  }

  createRecomendacion(recomendacion: Omit<Recomendacion, 'id'>): Observable<Recomendacion> {
    const newRecomendacion: Recomendacion = {
      ...recomendacion,
      id: this.recomendaciones.length + 1
    };
    this.recomendaciones.push(newRecomendacion);
    return of(newRecomendacion);
  }

  updateRecomendacion(id: number, recomendacion: Recomendacion): Observable<Recomendacion> {
    const index = this.recomendaciones.findIndex(r => r.id === id);
    if (index !== -1) {
      this.recomendaciones[index] = { ...recomendacion };
      return of(this.recomendaciones[index]);
    }
    throw new Error('Recomendación no encontrada');
  }

  deleteRecomendacion(id: number): Observable<void> {
    const index = this.recomendaciones.findIndex(r => r.id === id);
    if (index !== -1) {
      this.recomendaciones.splice(index, 1);
      return of(void 0);
    }
    throw new Error('Recomendación no encontrada');
  }

  getRecomendacionesByLibro(libroId: number): Observable<Recomendacion[]> {
    return of(this.recomendaciones.filter(r => r.libro.id === libroId));
  }

  getRecomendacionesByUsuario(usuarioId: number): Observable<Recomendacion[]> {
    return of(this.recomendaciones.filter(r => r.usuario.id === usuarioId));
  }
} 