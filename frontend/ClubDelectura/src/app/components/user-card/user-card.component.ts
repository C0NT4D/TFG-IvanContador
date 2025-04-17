import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Usuario } from '@app/models/usuario.model';
import { ConfirmModalComponent } from '@app/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule, RouterModule, ConfirmModalComponent],
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent {
  @Input() usuario!: Usuario;
  @Output() deleteUser = new EventEmitter<number>();
  
  showDeleteModal = false;

  onDeleteClick(event: Event): void {
    event.preventDefault();
    this.showDeleteModal = true;
  }
  
  confirmDelete(): void {
    this.deleteUser.emit(this.usuario.id);
    this.showDeleteModal = false;
  }
  
  cancelDelete(): void {
    this.showDeleteModal = false;
  }
} 