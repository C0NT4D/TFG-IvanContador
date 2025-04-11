import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LecturaService } from '../../../services/lectura.service';
import { Lectura } from '../../../models/lectura.model';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { ErrorComponent } from '../../../components/error/error.component';

@Component({
  selector: 'app-lectura-detalle',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    LoadingComponent,
    ErrorComponent
  ],
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
  lectura?: Lectura;
  loading = true;
  error = '';
  showDeleteModal = false;
  lecturaIdToDelete: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private lecturaService: LecturaService,
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
        this.error = 'Error al cargar los detalles de la lectura.';
        this.loading = false;
      }
    });
  }

  onStatusChange(event: Event): void {
    if (!this.lectura) return;
    
    const selectElement = event.target as HTMLSelectElement;
    const newStatus = selectElement.value as 'EN_PROGRESS' | 'COMPLETED' | 'ABANDONED';

    const updateData: Partial<Lectura> = {
      estadoLectura: newStatus
    };
    if (newStatus === 'COMPLETED' && !this.lectura.fechaFin) {
      updateData.fechaFin = new Date();
    } else if (newStatus !== 'COMPLETED') {
    }

    const lecturaCompletaParaActualizar: Lectura = {
      ...this.lectura,
      ...updateData
    };

    this.lecturaService.updateLectura(this.lectura.id, lecturaCompletaParaActualizar).subscribe({
      next: (updatedLectura: Lectura) => {
        this.lectura = updatedLectura; 
      },
      error: (err: Error) => {
        console.error('Error updating status:', err);
        this.error = 'Error al actualizar el estado de la lectura.';
      }
    });
  }

  onDeleteLectura(): void {
    if (this.lectura) {
       this.lecturaIdToDelete = this.lectura.id;
       this.showDeleteModal = true;
    }
  }

  confirmDelete(): void {
    if (this.lecturaIdToDelete) {
      this.lecturaService.deleteLectura(this.lecturaIdToDelete).subscribe({
        next: () => {
           console.log('Lectura eliminada');
           this.router.navigate(['/lectura']);
        },
        error: (err) => {
          console.error('Error deleting lectura:', err);
          this.error = 'Error al eliminar la lectura.';
        }
      });
    } else {
        this.onDeleteLectura();
    }
  }
}
