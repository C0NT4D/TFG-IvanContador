import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { ReadingCardComponent } from './reading-card.component';
import { Lectura } from '@app/models/lectura.model';
import { By } from '@angular/platform-browser';

describe('ReadingCardComponent', () => {
  let component: ReadingCardComponent;
  let fixture: ComponentFixture<ReadingCardComponent>;

  const mockLectura: Lectura = {
    id: 1,
    usuario: {
      id: 1,
      nombre: 'Test User',
      email: 'test@test.com',
      contrasena: '123456',
      rol: 'usuario',
      fechaRegistro: new Date()
    },
    libro: {
      id: 1,
      titulo: 'Test Book',
      autor: 'Test Author',
      genero: 'Test Genre',
      anioPublicacion: 2024,
      sinopsis: 'Test synopsis',
      lecturas: [],
      recomendacions: []
    },
    estadoLectura: 'EN_PROGRESS',
    fechaInicio: new Date(),
    fechaFin: null
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadingCardComponent, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ReadingCardComponent);
    component = fixture.componentInstance;
    component.lectura = mockLectura;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display book title and author', () => {
    const titleElement = fixture.debugElement.query(By.css('h2'));
    const authorElement = fixture.debugElement.query(By.css('p'));

    expect(titleElement.nativeElement.textContent).toContain('Test Book');
    expect(authorElement.nativeElement.textContent).toContain('Test Author');
  });

  it('should display correct status badge for EN_PROGRESS', () => {
    const statusElement = fixture.debugElement.query(By.css('.rounded-full'));
    
    expect(statusElement.nativeElement.textContent.trim()).toBe('En progreso');
    expect(statusElement.nativeElement.classList.contains('bg-yellow-100')).toBeTruthy();
    expect(statusElement.nativeElement.classList.contains('text-yellow-800')).toBeTruthy();
  });

  it('should display correct status badge for COMPLETED', () => {
    component.lectura = { ...mockLectura, estadoLectura: 'COMPLETED' };
    fixture.detectChanges();
    
    const statusElement = fixture.debugElement.query(By.css('.rounded-full'));
    
    expect(statusElement.nativeElement.textContent.trim()).toBe('Completado');
    expect(statusElement.nativeElement.classList.contains('bg-green-100')).toBeTruthy();
    expect(statusElement.nativeElement.classList.contains('text-green-800')).toBeTruthy();
  });

  it('should display correct status badge for ABANDONED', () => {
    component.lectura = { ...mockLectura, estadoLectura: 'ABANDONED' };
    fixture.detectChanges();
    
    const statusElement = fixture.debugElement.query(By.css('.rounded-full'));
    
    expect(statusElement.nativeElement.textContent.trim()).toBe('Abandonado');
    expect(statusElement.nativeElement.classList.contains('bg-red-100')).toBeTruthy();
    expect(statusElement.nativeElement.classList.contains('text-red-800')).toBeTruthy();
  });

  it('should have correct detail link', () => {
    const linkElement = fixture.debugElement.query(By.css('a'));
    
    expect(linkElement.attributes['ng-reflect-router-link']).toBe('1');
    expect(linkElement.nativeElement.textContent.trim()).toBe('Ver detalles');
  });

  it('should have hover styles', () => {
    const cardElement = fixture.debugElement.query(By.css('.reading-card'));
    
    expect(getComputedStyle(cardElement.nativeElement).transition).toContain('all');
  });
}); 