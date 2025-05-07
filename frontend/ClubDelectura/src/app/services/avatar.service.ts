import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  private avatarSubject = new BehaviorSubject<string>('assets/avatars/avatar1.png');
  avatar$ = this.avatarSubject.asObservable();

  updateAvatar(avatar: string) {
    this.avatarSubject.next(avatar);
  }

  getCurrentAvatar(): string {
    return this.avatarSubject.value;
  }
} 