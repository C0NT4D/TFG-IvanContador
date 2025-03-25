import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private usuarios: Usuario[] = [
    {
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
    {
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
    }
  ];

  constructor() { }

  getUsuarios(): Observable<Usuario[]> {
    return of(this.usuarios);
  }

  getUsuario(id: number): Observable<Usuario | undefined> {
    return of(this.usuarios.find(usuario => usuario.id === id));
  }

  getUsuarioByEmail(email: string): Observable<Usuario | undefined> {
    return of(this.usuarios.find(usuario => usuario.email === email));
  }

  login(email: string, contrasena: string): Observable<Usuario | undefined> {
    return of(this.usuarios.find(usuario => 
      usuario.email === email && usuario.contrasena === contrasena
    ));
  }

  register(usuario: Omit<Usuario, 'id'>): Observable<Usuario> {
    const newUsuario = {
      ...usuario,
      id: this.usuarios.length + 1,
      fechaRegistro: new Date()
    };
    this.usuarios.push(newUsuario);
    return of(newUsuario);
  }

  updateUsuario(id: number, usuario: Partial<Usuario>): Observable<Usuario | undefined> {
    const index = this.usuarios.findIndex(u => u.id === id);
    if (index !== -1) {
      this.usuarios[index] = { ...this.usuarios[index], ...usuario };
      return of(this.usuarios[index]);
    }
    return of(undefined);
  }

  deleteUsuario(id: number): Observable<boolean> {
    const index = this.usuarios.findIndex(u => u.id === id);
    if (index !== -1) {
      this.usuarios.splice(index, 1);
      return of(true);
    }
    return of(false);
  }
} 