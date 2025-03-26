import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Foro } from '../../models/foro.model';

@Component({
  selector: 'app-forum-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './forum-card.component.html',
  styleUrls: ['./forum-card.component.css']
})
export class ForumCardComponent {
  @Input() forum!: Foro;
} 