import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Usuario } from '@app/models/usuario.model';
import { Mensaje } from '@app/models/mensaje.model';
import { Lectura } from '@app/models/lectura.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  private apiUrl = '/api';

  constructor(private router: Router, private http: HttpClient) {
    try {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser && parsedUser.id) { 
           this.currentUserSubject.next(parsedUser);
           console.log('AuthService: Usuario cargado desde localStorage', this.currentUserSubject.value);
        } else {
          console.warn('AuthService: Datos inválidos en localStorage para currentUser.');
          localStorage.removeItem('currentUser'); 
        }
      } else {
          console.log('AuthService: No hay usuario en localStorage.');
      }
    } catch (error) {
       console.error('AuthService: Error al parsear usuario desde localStorage', error);
       localStorage.removeItem('currentUser'); 
       this.currentUserSubject.next(null); 
    }
  }

  login(email: string, password: string): Observable<Usuario> {
    console.log('AuthService: Intentando login con:', { email, password });
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      map(response => {
        console.log('AuthService: Respuesta del servidor:', response);
        if (response && response.id) {
          const user: Usuario = {
            id: response.id,
            nombre: response.nombre,
            email: response.email,
            rol: response.rol,
            contrasena: '', 
            fechaRegistro: new Date(response.fechaRegistro),
            lecturas: [],
            foros: [],
            mensajes: [],
            eventos: [],
            inscripcions: [],
            recomendacions: []
          };
          console.log('AuthService: Usuario construido:', user);
          this.setCurrentUser(user);
          return user;
        } else {
          throw new Error('Formato de respuesta inválido desde el servidor');
        }
      }),
      tap(user => {
        console.log('AuthService: Navegando después de login exitoso');
        this.router.navigate(['/libro']);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('AuthService: Error en login:', error);
        if (error.status === 401) {
          return throwError(() => new Error('Credenciales incorrectas'));
        }
        if (error.status === 0) {
          return throwError(() => new Error('No se pudo conectar con el servidor. ¿Está el backend en ejecución?'));
        }
        return this.handleError(error);
      })
    );
  }

  loginMock(email: string, password: string): Observable<Usuario> {
    if (email === 'admin@club.com' && password === 'admin123') {
      const user: Usuario = {
        id: 1,
        nombre: 'Administrador',
        email: 'admin@club.com',
        contrasena: '',
        rol: 'admin',
        fechaRegistro: new Date(),
        lecturas: [],
        foros: [],
        mensajes: [],
        eventos: [],
        inscripcions: [],
        recomendacions: []
      };
      this.setCurrentUser(user);
      this.router.navigate(['/perfil']);
      return of(user);
    }
    
    if (email === 'usuario@club.com' && password === 'usuario123') {
      const user: Usuario = {
        id: 2,
        nombre: 'Usuario',
        email: 'usuario@club.com',
        contrasena: '',
        rol: 'user',
          fechaRegistro: new Date(),
          lecturas: [],
          foros: [],
          mensajes: [],
          eventos: [],
          inscripcions: [],
          recomendacions: []
        };
      this.setCurrentUser(user);
      this.router.navigate(['/perfil']);
      return of(user);
    }
    
    return throwError(() => new Error('Usuario no encontrado o contraseña incorrecta'));
  }

  register(userData: { nombre: string; email: string; password: string }): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/usuario`, {
      nombre: userData.nombre,
      email: userData.email,
      contrasena: userData.password,
      rol: 'user'
    }).pipe(
      catchError(this.handleError)
    );
    }

  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  setCurrentUser(user: Usuario) {
    this.currentUserSubject.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  logout() {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  isAdmin(): boolean {
    return this.getCurrentUser()?.rol === 'admin';
  }

  addMensajeToCurrentUser(mensaje: Mensaje): void {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser };
        if (!updatedUser.mensajes) updatedUser.mensajes = [];
        if (!updatedUser.mensajes.some(m => m.id === mensaje.id)) {
          updatedUser.mensajes.push(mensaje);
          this.setCurrentUser(updatedUser);
        console.log(`Mensaje ID ${mensaje.id} añadido al usuario ID ${currentUser.id}`);
      } else {
        console.warn(`El mensaje ID ${mensaje.id} ya existe para el usuario ID ${currentUser.id}`);
      }
    } else {
      console.error('No hay usuario actual para añadir el mensaje.');
    }
  }

  addLecturaToCurrentUser(lectura: Lectura): void {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser };
      if (!updatedUser.lecturas) updatedUser.lecturas = [];
      
      const lecturaCopy: Partial<Lectura> = {
        id: lectura.id,
        estadoLectura: lectura.estadoLectura,
        fechaInicio: lectura.fechaInicio,
        fechaFin: lectura.fechaFin,
        libro: {
          id: lectura.libro.id,
          titulo: lectura.libro.titulo,
          autor: lectura.libro.autor,
          genero: lectura.libro.genero,
          anioPublicacion: lectura.libro.anioPublicacion,
          sinopsis: lectura.libro.sinopsis,
          lecturas: [],
          recomendacions: []
        }
      };

      if (!updatedUser.lecturas.some(l => l.id === lectura.id)) {
        updatedUser.lecturas.push(lecturaCopy as Lectura);
        this.setCurrentUser(updatedUser);
        console.log(`Lectura ID ${lectura.id} añadida al usuario ID ${currentUser.id}`);
      } else {
        console.warn(`La lectura ID ${lectura.id} ya existe para el usuario ID ${currentUser.id}`);
      }
    } else {
      console.error('No hay usuario actual para añadir la lectura.');
    }
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código de error: ${error.status}, mensaje: ${error.error?.message || error.statusText}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
} 