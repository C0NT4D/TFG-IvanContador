import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '@app/models/usuario.model';
import { Mensaje } from '@app/models/mensaje.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  // Usuarios de prueba
  private testUsers: Usuario[] = [
    {
      id: 1,
      nombre: 'Administrador',
      email: 'admin@club.com',
      contrasena: 'admin123',
      rol: 'admin',
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
      email: 'usuario@club.com',
      contrasena: 'usuario123',
      rol: 'user',
      fechaRegistro: new Date(),
      lecturas: [],
      foros: [],
      mensajes: [],
      eventos: [],
      inscripcions: [],
      recomendacions: []
    }
  ];

  constructor(private router: Router) {
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
    return new Observable<Usuario>(observer => {
      try {
        const user = this.testUsers.find(u => u.email === email);
        
        if (!user) {
          throw new Error('Usuario no encontrado');
        }

        // En local, cualquier contraseña funciona
        this.setCurrentUser(user);
        
        // Navegar después de que el usuario esté establecido
        this.router.navigate(['/perfil']).then(success => {
          if (success) {
            observer.next(user);
            observer.complete();
          } else {
            // Si falla la navegación, redirigir a la página principal
            this.router.navigate(['/']);
            observer.next(user);
            observer.complete();
          }
        });
      } catch (error) {
        observer.error(error);
      }
    });
  }
    // Nuevo método de registro
    register(userData: { nombre: string; email: string; password: string }): Observable<Usuario> {
      return new Observable<Usuario>(observer => {
        // Verificar si el email ya existe
        const existingUser = this.testUsers.find(u => u.email === userData.email);
        if (existingUser) {
          observer.error(new Error('El correo electrónico ya está registrado.'));
          return;
        }
  
        // Crear nuevo usuario
        const newUser: Usuario = {
          id: this.testUsers.length > 0 ? Math.max(...this.testUsers.map(u => u.id)) + 1 : 1, // Generar nuevo ID
          nombre: userData.nombre,
          email: userData.email,
          contrasena: userData.password, // En una app real, ¡esto se hashearía!
          rol: 'user', // Por defecto, rol 'user'
          fechaRegistro: new Date(),
          // Inicializar arrays vacíos
          lecturas: [],
          foros: [],
          mensajes: [],
          eventos: [],
          inscripcions: [],
          recomendacions: []
        };
  
        this.testUsers.push(newUser);
        console.log('Usuario registrado (mock):', newUser);
        console.log('Usuarios totales (mock):', this.testUsers);
  
        observer.next(newUser); // Devolver el nuevo usuario
        observer.complete();
      });
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
  addMensajeToCurrentUser(mensaje: Mensaje): void { // Asegúrate de importar Mensaje
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      const userIndex = this.testUsers.findIndex(u => u.id === currentUser.id);
      if (userIndex > -1) {
        const updatedUser = { ...this.testUsers[userIndex] };
        if (!updatedUser.mensajes) updatedUser.mensajes = [];
        if (!updatedUser.mensajes.some(m => m.id === mensaje.id)) {
          updatedUser.mensajes.push(mensaje);
          this.testUsers[userIndex] = updatedUser;
          this.setCurrentUser(updatedUser);
          console.log(`Mensaje ID ${mensaje.id} añadido al usuario mock ID ${currentUser.id}`);
        } else {
          console.warn(`El mensaje ID ${mensaje.id} ya existe para el usuario mock ID ${currentUser.id}`);
        }
      } else {
        console.error('Usuario actual no encontrado en testUsers para añadir mensaje.');
      }
    } else {
      console.error('No hay usuario actual para añadir el mensaje.');
    }
  }
} 