import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Evento } from '../../models/evento.model';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css']
})
export class EventCardComponent {
  @Input() event!: Evento;
  @Input() showDetails: boolean = true;
  @Output() delete = new EventEmitter<number>();

  onDelete() {
    this.delete.emit(this.event.id);
  }
} 