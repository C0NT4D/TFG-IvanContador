import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent {
  @Input() message: string = 'Ha ocurrido un error';
  @Input() showRetry: boolean = true;

  reload(): void {
    window.location.reload();
  }
} 