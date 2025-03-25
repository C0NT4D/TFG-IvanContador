import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Foro } from '../models/foro.model';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class ForoService {
  private foros: Foro[] = [
    {
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
    {
      id: 2,
      titulo: 'Recomendaciones',
      descripcion: 'Comparte tus libros favoritos',
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
    }
  ];

  constructor(private usuarioService: UsuarioService) { }

  getForos(): Observable<Foro[]> {
    return of(this.foros);
  }

  getForo(id: number): Observable<Foro | undefined> {
    return of(this.foros.find(foro => foro.id === id));
  }

  createForo(foro: Omit<Foro, 'id' | 'fechaCreacion'>): Observable<Foro> {
    const newForo = {
      ...foro,
      id: this.foros.length + 1,
      fechaCreacion: new Date()
    };
    this.foros.push(newForo);
    return of(newForo);
  }

  updateForo(id: number, foro: Partial<Foro>): Observable<Foro | undefined> {
    const index = this.foros.findIndex(f => f.id === id);
    if (index !== -1) {
      this.foros[index] = { ...this.foros[index], ...foro };
      return of(this.foros[index]);
    }
    return of(undefined);
  }

  deleteForo(id: number): Observable<boolean> {
    const index = this.foros.findIndex(f => f.id === id);
    if (index !== -1) {
      this.foros.splice(index, 1);
      return of(true);
    }
    return of(false);
  }

  getForosByAdmin(adminId: number): Observable<Foro[]> {
    return of(this.foros.filter(foro => foro.admin.id === adminId));
  }
} 