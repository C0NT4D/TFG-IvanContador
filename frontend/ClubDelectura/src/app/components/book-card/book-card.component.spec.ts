import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookCardComponent } from './book-card.component';
import { Libro } from '../../models/libro.model';

describe('BookCardComponent', () => {
  let component: BookCardComponent;
  let fixture: ComponentFixture<BookCardComponent>;

  const mockLibro: Libro = {
    id: 1,
    titulo: 'Test Book',
    autor: 'Test Author',
    genero: 'Test Genre',
    anioPublicacion: 2024,
    sinopsis: 'Test Synopsis',
    lecturas: [],
    recomendacions: []
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookCardComponent]
    }).compileComponents();
    
    fixture = TestBed.createComponent(BookCardComponent);
    component = fixture.componentInstance;
    component.libro = mockLibro;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display book information correctly', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.card-title').textContent).toBe('Test Book');
    expect(compiled.querySelector('.card-subtitle').textContent).toBe('Test Author');
    expect(compiled.querySelector('.card-text').textContent).toBe('Test Synopsis');
    expect(compiled.querySelector('.badge').textContent).toBe('Test Genre');
  });

  it('should have correct router link', () => {
    const compiled = fixture.nativeElement;
    const link = compiled.querySelector('a');
    expect(link.getAttribute('ng-reflect-router-link')).toBe('/libros,1');
  });
}); 