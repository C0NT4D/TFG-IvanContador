import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LecturaService } from '../../../services/lectura.service';
import { Lectura } from '../../../models/lectura.model';
import { AuthService } from '../../../services/auth.service';
import { Usuario } from '../../../models/usuario.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-lectura-detalle',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
  ],
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
  lectura?: Lectura;
  loading = true;
  error = '';
  isReading = false;
  libroId?: number;

  constructor(
    private route: ActivatedRoute,
    private lecturaService: LecturaService,
    private authService: AuthService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = Number(params['id']);
      if (id) {
        this.loadLectura(id);
      } else {
        this.loading = false;
        this.error = 'ID de lectura no válido.';
      }
    });
  }

  loadLectura(id: number): void {
    this.loading = true;
    this.error = '';
    this.lecturaService.getLectura(id).subscribe({
      next: (lectura: Lectura | undefined) => {
        if (lectura) {
          this.lectura = lectura;
        } else {
          this.error = 'Lectura no encontrada.';
        }
        this.loading = false;
      },
      error: (err: Error) => {
        console.error('Error loading lectura:', err);
        this.error = err.message || 'Error al cargar los detalles de la lectura.';
        this.loading = false;
        if (err.message === 'No tienes permiso para ver esta lectura') {
          this.router.navigate(['/lecturas']);
        }
      }
    });
  }

  onStatusChange(event: Event): void {
    if (!this.lectura) return;
    
    const selectElement = event.target as HTMLSelectElement;
    const newStatus = selectElement.value as 'EN_PROGRESS' | 'COMPLETED' | 'ABANDONED';

    const lecturaCompletaParaActualizar: Lectura = {
      ...this.lectura,
      usuario: {
        ...this.lectura.usuario,
        id: this.authService.getCurrentUser()?.id || 1
      },
      libro: {
        ...this.lectura.libro,
        id: typeof this.lectura.libro === 'string' ? 4 : this.lectura.libro.id
      },
      estadoLectura: newStatus,
      fechaFin: newStatus === 'COMPLETED' || newStatus === 'ABANDONED' ? new Date() : null
    };

    console.log('Actualizando lectura con datos:', lecturaCompletaParaActualizar);

    this.lecturaService.updateLectura(this.lectura.id, lecturaCompletaParaActualizar).subscribe({
      next: (updatedLectura: Lectura) => {
        this.lectura = updatedLectura;
        console.log('Lectura actualizada:', updatedLectura);
      },
      error: (err: Error) => {
        console.error('Error updating status:', err);
        this.error = 'Error al actualizar el estado de la lectura.';
      }
    });
  }

  checkReadingStatus(): void {
    this.loading = true;
    this.error = '';
    
    this.lecturaService.getLecturas().pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: (lecturas) => {
        const lectura = lecturas.find(l => l.libro.id === this.libroId);
        if (lectura) {
          this.lectura = lectura;
          this.isReading = true;
        } else {
          this.isReading = false;
          this.lectura = undefined;
        }
      },
      error: (error) => {
        console.error('Error checking reading status:', error);
        this.error = 'Error al verificar el estado de lectura';
        this.isReading = false;
        this.lectura = undefined;
      }
    });
  }

  startReading(): void {
    if (!this.libroId) {
      this.error = 'No se ha seleccionado un libro';
      return;
    }

    this.loading = true;
    this.error = '';

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.error = 'Usuario no autenticado';
      this.loading = false;
      return;
    }

    const nuevaLectura = {
      usuario: { id: currentUser.id },
      libro: { id: this.libroId },
      estadoLectura: 'EN_PROGRESS',
      fechaInicio: new Date().toISOString(),
      fechaFin: null
    };

    this.lecturaService.createLectura(nuevaLectura).subscribe({
      next: (lectura) => {
        this.lectura = lectura;
        this.isReading = true;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error starting reading:', error);
        this.error = 'Error al iniciar la lectura';
        this.loading = false;
      }
    });
  }
}
