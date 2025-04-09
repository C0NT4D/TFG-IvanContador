import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { Usuario } from '@app/models/usuario.model';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  nombre: string = '';
  email: string = '';
  password: string = '';
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.error = null;
    const newUser: Usuario = {
      id: 0,
      nombre: this.nombre,
      email: this.email,
      contrasena: this.password,
      rol: 'user',
      fechaRegistro: new Date().toISOString(),
      lecturas: [],
      foros: [],
      mensajes: [],
      eventos: [],
      inscripcions: [],
      recomendacions: []
    };

    // En local, simplemente establecemos el usuario y redirigimos
    this.authService.setCurrentUser(newUser);
    this.router.navigate(['/perfil']);
  }
}
