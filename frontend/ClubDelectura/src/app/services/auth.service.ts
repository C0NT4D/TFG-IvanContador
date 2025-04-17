import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Usuario } from '@app/models/usuario.model';
import { Mensaje } from '@app/models/mensaje.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  private apiUrl = '/api';

  constructor(private router: Router, private http: HttpClient) {
    // Cargar usuario del localStorage al iniciar con try-catch
    try {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        // Podríamos añadir una validación extra aquí si fuera necesario
        if (parsedUser && parsedUser.id) { 
           this.currentUserSubject.next(parsedUser);
           console.log('AuthService: Usuario cargado desde localStorage', this.currentUserSubject.value);
        } else {
          console.warn('AuthService: Datos inválidos en localStorage para currentUser.');
          localStorage.removeItem('currentUser'); // Limpiar si es inválido
        }
      } else {
          console.log('AuthService: No hay usuario en localStorage.');
      }
    } catch (error) {
       console.error('AuthService: Error al parsear usuario desde localStorage', error);
       localStorage.removeItem('currentUser'); // Limpiar si hay error
       this.currentUserSubject.next(null); // Asegurar estado nulo si falla
    }
  }

  login(email: string, password: string): Observable<Usuario> {
    // Llamada a la API real para autenticación
    console.log('AuthService: Intentando login con:', { email, password });
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      map(response => {
        console.log('AuthService: Respuesta del servidor:', response);
        // Verificar si la respuesta contiene los datos necesarios para un usuario
        if (response && response.id) {
          const user: Usuario = {
            id: response.id,
            nombre: response.nombre,
            email: response.email,
            rol: response.rol,
            contrasena: '', // No almacenamos la contraseña por seguridad
            fechaRegistro: new Date(response.fechaRegistro),
            lecturas: [],
            foros: [],
            mensajes: [],
            eventos: [],
            inscripcions: [],
            recomendacions: []
          };
          console.log('AuthService: Usuario construido:', user);
          // Guardar usuario en local y emitir evento
          this.setCurrentUser(user);
          return user;
        } else {
          // Si la respuesta no tiene el formato esperado, lanzar error
          throw new Error('Formato de respuesta inválido desde el servidor');
        }
      }),
      tap(user => {
        // Navegar después de procesar correctamente el usuario
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

  // Método para verificar las credenciales (para pruebas)
  loginMock(email: string, password: string): Observable<Usuario> {
    // Credenciales de prueba, eliminar en producción
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
    // Llamada a la API real para registro
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

  // --- Añadir método para mensajes ---
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

  // Método genérico para manejar errores de HttpClient
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código de error: ${error.status}, mensaje: ${error.error?.message || error.statusText}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
} 