import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Mensaje } from '../../models/mensaje.model';

@Component({
  selector: 'app-forum-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './forum-message.component.html',
  styleUrls: ['./forum-message.component.css']
})
export class ForumMessageComponent {
  @Input() message!: Mensaje;
  @Input() isCurrentUser: boolean = false;
} 