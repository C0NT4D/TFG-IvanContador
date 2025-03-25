import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Inscripcion } from '../models/inscripcion.model';
import { EventoService } from './evento.service';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class InscripcionService {
  private inscripcions: Inscripcion[] = [
    {
      id: 1,
      evento: {
        id: 1,
        titulo: 'Club de Lectura Mensual',
        descripcion: 'Reunión mensual para discutir el libro seleccionado',
        fecha: new Date('2024-04-01'),
        ubicacion: 'Biblioteca Municipal',
        organizador: {
          id: 1,
          nombre: 'Admin',
          email: 'admin@example.com',
          contrasena: 'admin123',
          rol: 'ROLE_ADMIN',
          fechaRegistro: new Date(),
          lecturas: [],
          foros: [],
          mensajes: [],
          eventos: [],
          inscripcions: [],
          recomendacions: []
        },
        inscripcions: []
      },
      usuario: {
        id: 2,
        nombre: 'Usuario',
        email: 'usuario@example.com',
        contrasena: 'user123',
        rol: 'ROLE_USER',
        fechaRegistro: new Date(),
        lecturas: [],
        foros: [],
        mensajes: [],
        eventos: [],
        inscripcions: [],
        recomendacions: []
      },
      fechaInscripcion: new Date()
    }
  ];

  constructor(
    private eventoService: EventoService,
    private usuarioService: UsuarioService
  ) { }

  getInscripcions(): Observable<Inscripcion[]> {
    return of(this.inscripcions);
  }

  getInscripcion(id: number): Observable<Inscripcion | undefined> {
    return of(this.inscripcions.find(inscripcion => inscripcion.id === id));
  }

  createInscripcion(inscripcion: Omit<Inscripcion, 'id' | 'fechaInscripcion'>): Observable<Inscripcion> {
    const newInscripcion = {
      ...inscripcion,
      id: this.inscripcions.length + 1,
      fechaInscripcion: new Date()
    };
    this.inscripcions.push(newInscripcion);
    return of(newInscripcion);
  }

  deleteInscripcion(id: number): Observable<boolean> {
    const index = this.inscripcions.findIndex(i => i.id === id);
    if (index !== -1) {
      this.inscripcions.splice(index, 1);
      return of(true);
    }
    return of(false);
  }

  getInscripcionsByEvento(eventoId: number): Observable<Inscripcion[]> {
    return of(this.inscripcions.filter(inscripcion => inscripcion.evento.id === eventoId));
  }

  getInscripcionsByUsuario(usuarioId: number): Observable<Inscripcion[]> {
    return of(this.inscripcions.filter(inscripcion => inscripcion.usuario.id === usuarioId));
  }

  isUsuarioInscrito(eventoId: number, usuarioId: number): Observable<boolean> {
    return of(this.inscripcions.some(inscripcion => 
      inscripcion.evento.id === eventoId && inscripcion.usuario.id === usuarioId
    ));
  }
} 