import { Component, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { RouterModule, ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario.model';
import { HttpClient } from '@angular/common/http';

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
  estadisticas = {
    librosLeidos: 0,
    librosEnProgreso: 0,
    librosPendientes: 0
  };

  constructor(
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadUsuario(id);
    } else {
      this.error = 'ID de usuario no válido';
      this.loading = false;
    }
  }

  loadUsuario(id: number): void {
    this.loading = true;
    this.error = null;
    this.usuarioService.getUsuario(id).subscribe({
      next: (usuario) => {
        this.usuario = usuario || null;
        this.cargarEstadisticas(id);
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar los datos del usuario';
        this.loading = false;
        console.error('Error loading user:', error);
      }
    });
  }

  cargarEstadisticas(usuarioId: number): void {
    this.http.get(`/api/lecturas/usuario/${usuarioId}/estadisticas`).subscribe({
      next: (data: any) => {
        this.estadisticas = data;
      },
      error: (error) => {
        console.error('Error al cargar estadísticas:', error);
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