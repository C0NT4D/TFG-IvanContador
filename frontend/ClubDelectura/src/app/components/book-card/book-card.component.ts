import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Libro } from '../../models/libro.model';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.css']
})
export class BookCardComponent {
  @Input() libro!: Libro;
  @Input() showDelete: boolean = false;
  @Output() delete = new EventEmitter<number>();

  onDelete(): void {
    this.delete.emit(this.libro.id);
  }
} 