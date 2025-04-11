import { Component, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { RouterModule, ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario.model';

@Component({
  selector: 'app-usuario-detalle',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TitleCasePipe,
    RouterModule,
    FormsModule,
  ],
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
  usuario: Usuario | null = null;
  loading = true;
  error: string | null = null;
  showDeleteModal = false;

  constructor(
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadUsuario(Number(id));
      } else {
        this.error = 'No se proporcionó un ID de usuario.';
        this.loading = false;
      }
    });
  }

  loadUsuario(id: number): void {
    this.loading = true;
    this.error = null;
    this.usuarioService.getUsuario(id).subscribe({
      next: (usuario: Usuario | undefined) => {
        this.usuario = usuario ?? null;
        if (!usuario) {
          this.error = 'Usuario no encontrado.';
        }
        this.loading = false;
      },
      error: (err: Error) => {
        console.error('Error al cargar el usuario:', err);
        this.error = 'Error al cargar los detalles del usuario.';
        this.loading = false;
      }
    });
  }

  openDeleteModal(): void {
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }

  confirmDelete(): void {
    if (this.usuario) {
      this.loading = true;
      this.error = null;
      this.usuarioService.deleteUsuario(this.usuario.id).subscribe({
        next: () => {
          this.loading = false;
          this.closeDeleteModal();
          this.router.navigate(['/usuario']);
        },
        error: (error: Error) => {
          this.error = 'Error al eliminar el usuario';
          this.loading = false;
          console.error('Error deleting user:', error);
        }
      });
    }
  }
} 