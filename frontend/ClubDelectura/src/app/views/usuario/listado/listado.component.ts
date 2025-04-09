import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { UsuarioService } from '@app/services/usuario.service';
import { Usuario } from '@app/models/usuario.model';
import { UserCardComponent } from '@app/components/user-card/user-card.component';
import { LoadingComponent } from '@app/components/loading/loading.component';
import { ErrorComponent } from '@app/components/error/error.component';
import { AuthService } from '@app/services/auth.service';

@Component({
  selector: 'app-usuario-listado',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    UserCardComponent,
    LoadingComponent,
    ErrorComponent
  ],
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.css']
})
export class ListadoComponent implements OnInit {
  usuarios: Usuario[] = [];
  loading = true;
  error: string | null = null;
  isAdmin = false;

  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkAdminStatus();
    if (this.isAdmin) {
      this.loadUsuarios();
    } else {
      this.router.navigate(['/']);
    }
  }

  checkAdminStatus() {
    this.isAdmin = this.authService.isAdmin();
  }

  loadUsuarios(): void {
    this.loading = true;
    this.error = null;
    this.usuarioService.getUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar los usuarios';
        this.loading = false;
      }
    });
  }
} 