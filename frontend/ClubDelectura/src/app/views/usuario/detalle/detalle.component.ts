import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario.service';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { ErrorComponent } from '../../../components/error/error.component';

@Component({
  selector: 'app-usuario-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LoadingComponent, ErrorComponent],
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
  usuario: any = null;
  loading = true;
  error: string | null = null;
  showDeleteModal = false;

  constructor(
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(id)) {
      this.loadUsuario(id);
    }
  }

  loadUsuario(id: number): void {
    this.loading = true;
    this.error = null;
    this.usuarioService.getUsuario(id).subscribe({
      next: (data) => {
        this.usuario = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar los datos del usuario';
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
          this.router.navigate(['/usuarios']);
        },
        error: (error) => {
          this.error = 'Error al eliminar el usuario';
          this.loading = false;
        }
      });
    }
  }
} 