import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Usuario } from '@app/models/usuario.model';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent {
  @Input() usuario!: Usuario;
  @Output() deleteUser = new EventEmitter<number>();

  onDeleteClick(event: Event): void {
    event.preventDefault();
    if (confirm(`¿Estás seguro que deseas eliminar al usuario ${this.usuario.nombre}?`)) {
      this.deleteUser.emit(this.usuario.id);
    }
  }
} 