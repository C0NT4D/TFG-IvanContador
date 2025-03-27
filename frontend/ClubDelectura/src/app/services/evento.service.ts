import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

interface Organizador {
  id: number;
  nombre: string;
  email: string;
}

interface Evento {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string; 
  ubicacion: string;
  organizador: Organizador | null;
}

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  private eventos: Evento[] = [
    {
      id: 1,
      titulo: 'Club de Lectura Mensual',
      descripcion: 'Reunión mensual para discutir el libro seleccionado',
      fecha: '2024-04-01 19:00:00',
      ubicacion: 'Biblioteca Municipal',
      organizador: {
        id: 1,
        nombre: 'Admin',
        email: 'admin@example.com'
      }
    },
    {
      id: 2,
      titulo: 'Taller de Escritura Creativa',
      descripcion: 'Taller para desarrollar técnicas de escritura creativa',
      fecha: '2024-04-15 18:30:00', 
      ubicacion: 'Centro Cultural',
      organizador: {
        id: 1,
        nombre: 'Admin',
        email: 'admin@example.com'
      }
    }
  ];

  constructor() { }

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

  // Métodos adicionales para mantener consistencia
  getEventosByOrganizador(organizadorId: number): Observable<Evento[]> {
    return of(this.eventos.filter(evento => evento.organizador?.id === organizadorId));
  }
}