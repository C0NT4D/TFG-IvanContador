import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LecturaService } from '../../../services/lectura.service';
import { Lectura } from '../../../models/lectura.model';
import { AuthService } from '../../../services/auth.service';
import { Usuario } from '../../../models/usuario.model';

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
}
