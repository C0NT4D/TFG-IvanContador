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
      nombre: 'Administrador',
      email: 'admin@club.com',
      contrasena: 'club123',
      rol: 'ROLE_ADMIN',
      fechaRegistro: new Date('2024-01-01'),
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
      email: 'usuario@club.com',
      contrasena: 'club123',
      rol: 'ROLE_USER',
      fechaRegistro: new Date('2024-01-02'),
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

  createUsuario(userData: { nombre: string; email: string; contrasena: string }): Observable<Usuario> {
    const newUsuario: Usuario = {
      id: this.usuarios.length + 1,
      nombre: userData.nombre,
      email: userData.email,
      contrasena: userData.contrasena,
      rol: 'ROLE_USER',
      fechaRegistro: new Date(),
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

  updateUsuario(id: number, usuario: Partial<Usuario>): Observable<Usuario> {
    const index = this.usuarios.findIndex(u => u.id === id);
    if (index === -1) {
      throw new Error('Usuario no encontrado');
    }
    this.usuarios[index] = { ...this.usuarios[index], ...usuario };
    return of(this.usuarios[index]);
  }

  deleteUsuario(id: number): Observable<void> {
    const index = this.usuarios.findIndex(u => u.id === id);
    if (index === -1) {
      throw new Error('Usuario no encontrado');
    }
    this.usuarios.splice(index, 1);
    return of(void 0);
  }

  login(email: string, contrasena: string): Observable<Usuario | null> {
    const usuario = this.usuarios.find(
      u => u.email === email && u.contrasena === contrasena
    );
    return of(usuario || null);
  }
} 