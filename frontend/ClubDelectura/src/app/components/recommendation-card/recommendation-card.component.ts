import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Recomendacion } from '@app/models/recomendacion.model';

@Component({
  selector: 'app-recommendation-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recommendation-card.component.html',
  styleUrls: ['./recommendation-card.component.css']
})
export class RecommendationCardComponent {
  @Input() recomendacion!: Recomendacion;
} 