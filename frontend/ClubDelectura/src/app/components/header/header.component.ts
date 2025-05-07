import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { AvatarService } from '@app/services/avatar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  isAdmin = false;
  selectedAvatar: string = 'assets/avatars/avatar1.png';
  private avatarSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private avatarService: AvatarService
  ) {
    this.avatarSubscription = this.avatarService.avatar$.subscribe(avatar => {
      this.selectedAvatar = avatar;
    });
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.isAdmin = this.authService.isAdmin();
      if (user) {
        const storedAvatar = localStorage.getItem(`avatar_${user.id}`);
        if (storedAvatar) {
          this.avatarService.updateAvatar(storedAvatar);
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.avatarSubscription) {
      this.avatarSubscription.unsubscribe();
    }
  }

  logout() {
    this.authService.logout();
  }
}
