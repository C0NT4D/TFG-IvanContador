import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '@app/models/usuario.model';

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
      fechaRegistro: new Date().toISOString(),
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
      fechaRegistro: new Date().toISOString(),
      lecturas: [],
      foros: [],
      mensajes: [],
      eventos: [],
      inscripcions: [],
      recomendacions: []
    }
  ];

  constructor(private router: Router) {
    // Cargar usuario del localStorage al iniciar
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
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
          fechaRegistro: new Date().toISOString(),
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
} 