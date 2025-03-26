import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Inscripcion } from '../../models/inscripcion.model';

@Component({
  selector: 'app-inscription-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './inscription-card.component.html',
  styleUrls: ['./inscription-card.component.css']
})
export class InscriptionCardComponent {
  @Input() inscription!: Inscripcion;
  @Input() showDetails: boolean = true;
} 