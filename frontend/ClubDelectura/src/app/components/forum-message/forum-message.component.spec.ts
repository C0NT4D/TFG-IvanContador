import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForumMessageComponent } from './forum-message.component';
import { Mensaje } from '../../models/mensaje.model';
import { Foro } from '../../models/foro.model';

describe('ForumMessageComponent', () => {
  let component: ForumMessageComponent;
  let fixture: ComponentFixture<ForumMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForumMessageComponent]
    }).compileComponents();
    
    fixture = TestBed.createComponent(ForumMessageComponent);
    component = fixture.componentInstance;
    
    // Mock message data
    const mockForo: Foro = {
      id: 1,
      titulo: 'Test Forum',
      descripcion: 'Test Description',
      fechaCreacion: new Date(),
      admin: {
        id: 1,
        nombre: 'Test Admin'
      },
      mensajes: []
    };

    component.message = {
      id: 1,
      contenido: 'Test Message',
      fechaEnvio: new Date(),
      usuario: {
        id: 1,
        nombre: 'Test User'
      },
      foro: mockForo
    };
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display message content', () => {
    const contentElement = fixture.nativeElement.querySelector('.message-content p');
    expect(contentElement.textContent).toContain('Test Message');
  });

  it('should display author name', () => {
    const authorElement = fixture.nativeElement.querySelector('.message-author');
    expect(authorElement.textContent).toContain('Test User');
  });

  it('should apply current-user class when isCurrentUser is true', () => {
    component.isCurrentUser = true;
    fixture.detectChanges();
    
    const containerElement = fixture.nativeElement.querySelector('.message-container');
    expect(containerElement.classList.contains('message-current-user')).toBeTrue();
  });
}); 