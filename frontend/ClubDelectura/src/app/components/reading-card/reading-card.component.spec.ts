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
    titulo: 'Test Book',
    autor: 'Test Author',
    genero: 'Test Genre',
    descripcion: 'Test Description',
    estado: 'EN_PROGRESO',
    fechaInicio: new Date('2024-01-01'),
    fechaFin: null,
    valoracion: 4,
    reseña: 'Test Review'
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

  it('should display lectura data correctly', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h3').textContent).toContain(mockLectura.titulo);
    expect(compiled.querySelector('.text-gray-600').textContent).toContain(mockLectura.autor);
    expect(compiled.querySelector('.text-sm.text-gray-500').textContent).toContain(mockLectura.genero);
  });

  it('should display correct status badge', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.status-badge').textContent).toContain('En progreso');
  });

  it('should display correct date format', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.text-sm.text-gray-500').textContent).toContain('1 de enero de 2024');
  });

  it('should display rating stars correctly', () => {
    const compiled = fixture.nativeElement;
    const stars = compiled.querySelectorAll('.text-yellow-400');
    expect(stars.length).toBe(mockLectura.valoracion);
  });

  it('should display empty stars for no rating', () => {
    component.lectura.valoracion = 0;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    const emptyStars = compiled.querySelectorAll('.text-gray-300');
    expect(emptyStars.length).toBe(5);
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