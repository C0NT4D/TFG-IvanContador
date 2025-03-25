import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Evento } from '../models/evento.model';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  private eventos: Evento[] = [
    {
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
    {
      id: 2,
      titulo: 'Taller de Escritura Creativa',
      descripcion: 'Taller para desarrollar técnicas de escritura creativa',
      fecha: new Date('2024-04-15'),
      ubicacion: 'Centro Cultural',
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
    }
  ];

  constructor(private usuarioService: UsuarioService) { }

  getEventos(): Observable<Evento[]> {
    return of(this.eventos);
  }

  getEvento(id: number): Observable<Evento | undefined> {
    return of(this.eventos.find(evento => evento.id === id));
  }

  createEvento(evento: Omit<Evento, 'id'>): Observable<Evento> {
    const newEvento = {
      ...evento,
      id: this.eventos.length + 1
    };
    this.eventos.push(newEvento);
    return of(newEvento);
  }

  updateEvento(id: number, evento: Partial<Evento>): Observable<Evento | undefined> {
    const index = this.eventos.findIndex(e => e.id === id);
    if (index !== -1) {
      this.eventos[index] = { ...this.eventos[index], ...evento };
      return of(this.eventos[index]);
    }
    return of(undefined);
  }

  deleteEvento(id: number): Observable<boolean> {
    const index = this.eventos.findIndex(e => e.id === id);
    if (index !== -1) {
      this.eventos.splice(index, 1);
      return of(true);
    }
    return of(false);
  }

  getEventosByOrganizador(organizadorId: number): Observable<Evento[]> {
    return of(this.eventos.filter(evento => evento.organizador.id === organizadorId));
  }

  getEventosProximos(): Observable<Evento[]> {
    const hoy = new Date();
    return of(this.eventos.filter(evento => evento.fecha > hoy));
  }
} 