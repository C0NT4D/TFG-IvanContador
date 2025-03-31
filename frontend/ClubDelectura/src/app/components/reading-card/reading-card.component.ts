import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Lectura } from '@app/models/lectura.model';

@Component({
  selector: 'app-reading-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './reading-card.component.html',
  styleUrls: ['./reading-card.component.css']
})
export class ReadingCardComponent {
  @Input() lectura!: Lectura;
} 