import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserCardComponent } from './user-card.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('UserCardComponent', () => {
  let component: UserCardComponent;
  let fixture: ComponentFixture<UserCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCardComponent, RouterTestingModule]
    }).compileComponents();
    
    fixture = TestBed.createComponent(UserCardComponent);
    component = fixture.componentInstance;
    component.usuario = {
      id: 1,
      nombre: 'Test User',
      email: 'test@example.com',
      rol: 'usuario',
      fechaRegistro: '2024-01-01',
      lecturas: [],
      foros: [],
      eventos: [],
      mensajes: [],
      inscripcions: [],
      recomendacions: []
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user information correctly', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h3').textContent).toContain('Test User');
    expect(compiled.querySelector('.user-email').textContent).toContain('test@example.com');
    expect(compiled.querySelector('.user-rol').textContent).toContain('usuario');
  });

  it('should display correct statistics', () => {
    const compiled = fixture.nativeElement;
    const stats = compiled.querySelectorAll('.stat-item');
    expect(stats[0].textContent).toContain('0');
    expect(stats[1].textContent).toContain('0');
    expect(stats[2].textContent).toContain('0');
  });

  it('should have a link to user details', () => {
    const compiled = fixture.nativeElement;
    const link = compiled.querySelector('a');
    expect(link.getAttribute('href')).toBe('/usuarios/1');
  });
}); 