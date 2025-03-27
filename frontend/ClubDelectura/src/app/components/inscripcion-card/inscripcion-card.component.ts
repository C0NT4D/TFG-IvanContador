import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Inscripcion {
  id: number;
  evento: {
    id: number;
    titulo: string;
  };
  usuario: {
    id: number;
    nombre: string;
  };
  fechaInscripcion: Date;
}

@Component({
  selector: 'app-inscripcion-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="inscripcion-card">
      <div class="inscripcion-info">
        <span class="usuario">{{ inscripcion.usuario.nombre }}</span>
        <span class="fecha">{{ inscripcion.fechaInscripcion | date:'medium' }}</span>
      </div>
    </div>
  `,
  styles: [`
    .inscripcion-card {
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-bottom: 0.5rem;
    }
    .inscripcion-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .usuario {
      font-weight: 500;
    }
    .fecha {
      color: #666;
      font-size: 0.9rem;
    }
  `]
})
export class InscripcionCardComponent {
  @Input() inscripcion!: Inscripcion;
} 