import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() showDelete: boolean = false;
  @Output() delete = new EventEmitter<number>();

  onDelete() {
    this.delete.emit(this.recomendacion.id);
  }
} 