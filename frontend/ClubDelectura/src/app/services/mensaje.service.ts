import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Mensaje } from '../models/mensaje.model';
import { ForoService } from './foro.service';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class MensajeService {
  private mensajes: Mensaje[] = [
    {
      id: 1,
      foro: {
        id: 1,
        titulo: 'General',
        descripcion: 'Foro general de discusión',
        fechaCreacion: new Date(),
        admin: {
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
        mensajes: []
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
      contenido: '¡Bienvenidos al foro!',
      fechaEnvio: new Date()
    }
  ];

  constructor(
    private foroService: ForoService,
    private usuarioService: UsuarioService
  ) { }

  getMensajes(): Observable<Mensaje[]> {
    return of(this.mensajes);
  }

  getMensaje(id: number): Observable<Mensaje | undefined> {
    return of(this.mensajes.find(mensaje => mensaje.id === id));
  }

  getMensajesByForo(foroId: number): Observable<Mensaje[]> {
    return of(this.mensajes.filter(mensaje => mensaje.foro.id === foroId));
  }

  createMensaje(mensaje: Omit<Mensaje, 'id' | 'fechaEnvio'>): Observable<Mensaje> {
    const newMensaje = {
      ...mensaje,
      id: this.mensajes.length + 1,
      fechaEnvio: new Date()
    };
    this.mensajes.push(newMensaje);
    return of(newMensaje);
  }

  updateMensaje(id: number, mensaje: Partial<Mensaje>): Observable<Mensaje | undefined> {
    const index = this.mensajes.findIndex(m => m.id === id);
    if (index !== -1) {
      this.mensajes[index] = { ...this.mensajes[index], ...mensaje };
      return of(this.mensajes[index]);
    }
    return of(undefined);
  }

  deleteMensaje(id: number): Observable<boolean> {
    const index = this.mensajes.findIndex(m => m.id === id);
    if (index !== -1) {
      this.mensajes.splice(index, 1);
      return of(true);
    }
    return of(false);
  }

  getMensajesByUsuario(usuarioId: number): Observable<Mensaje[]> {
    return of(this.mensajes.filter(mensaje => mensaje.usuario.id === usuarioId));
  }
} 