import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Usuario } from '@app/models/usuario.model';

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
      fechaRegistro: '2024-01-01',
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
      fechaRegistro: '2024-01-02',
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

  createUsuario(usuario: Omit<Usuario, 'id'>): Observable<Usuario> {
    const newUsuario = {
      ...usuario,
      id: this.usuarios.length + 1,
      fechaRegistro: new Date().toISOString(),
      lecturas: [],
      foros: [],
      mensajes: [],
      eventos: [],
      inscripcions: [],
      recomendacions: []
    };
    this.usuarios.push(newUsuario);
    return of(newUsuario);
  }

  updateUsuario(id: number, usuario: Usuario): Observable<Usuario | undefined> {
    const index = this.usuarios.findIndex(u => u.id === id);
    if (index !== -1) {
      this.usuarios[index] = { 
        ...this.usuarios[index], 
        ...usuario,
        fechaRegistro: typeof usuario.fechaRegistro === 'string' 
          ? usuario.fechaRegistro 
          : usuario.fechaRegistro.toISOString()
      };
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