import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Evento } from '../models/evento.model';
import { Usuario } from '../models/usuario.model'; 
import { Inscripcion } from '../models/inscripcion.model';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  private eventos: Evento[] = [
    {
      id: 1,
      titulo: 'Club de Lectura Mensual',
      descripcion: 'Reunión mensual para discutir el libro seleccionado',
      fecha: new Date('2024-04-01T19:00:00'),
      ubicacion: 'Biblioteca Municipal',
      organizador: { 
        id: 1,
        nombre: 'Admin',
        email: 'admin@example.com',
        contrasena: 'admin123',
        rol: 'admin',
        fechaRegistro: new Date(),
        lecturas: [], foros: [], mensajes: [], eventos: [], inscripcions: [], recomendacions: []
      } as Usuario, 
      inscripcions: []
    } as Evento,
    {
      id: 2,
      titulo: 'Taller de Escritura Creativa',
      descripcion: 'Taller para desarrollar técnicas de escritura creativa',
      fecha: new Date('2024-04-15T18:30:00'),
      ubicacion: 'Centro Cultural',
      organizador: { 
         id: 1,
        nombre: 'Admin',
        email: 'admin@example.com',
        contrasena: 'admin123',
        rol: 'admin',
        fechaRegistro: new Date(),
        lecturas: [], foros: [], mensajes: [], eventos: [], inscripcions: [], recomendacions: []
      } as Usuario, 
      inscripcions: []
    } as Evento
  ];

  constructor() { }

  getEventos(): Observable<Evento[]> {
    return of(this.eventos);
  }

  getEvento(id: number): Observable<Evento | undefined> {
    const evento = this.eventos.find(evento => evento.id === id);
    return of(evento);
  }

  createEvento(eventoData: Omit<Evento, 'id' | 'inscripcions'> & { inscripcions?: Inscripcion[] }): Observable<Evento> {
    const newEvento: Evento = {
      ...eventoData,
      id: this.eventos.length > 0 ? Math.max(...this.eventos.map(e => e.id)) + 1 : 1,
      fecha: typeof eventoData.fecha === 'string' ? new Date(eventoData.fecha) : eventoData.fecha,
      inscripcions: eventoData.inscripcions ?? []
    };
    this.eventos.push(newEvento);
    return of(newEvento);
  }

  updateEvento(id: number, eventoUpdate: Partial<Omit<Evento, 'id'>>): Observable<Evento | undefined> {
    const index = this.eventos.findIndex(e => e.id === id);
    if (index !== -1) {
      const updatedEvento = { 
          ...this.eventos[index], 
          ...eventoUpdate,
          fecha: eventoUpdate.fecha !== undefined 
                 ? (typeof eventoUpdate.fecha === 'string' ? new Date(eventoUpdate.fecha) : eventoUpdate.fecha) 
                 : this.eventos[index].fecha
      };
      this.eventos[index] = updatedEvento;
      return of(updatedEvento);
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
    return of(this.eventos.filter(evento => evento.organizador?.id === organizadorId));
  }
}