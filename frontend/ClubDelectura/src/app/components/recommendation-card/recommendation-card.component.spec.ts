import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { RecommendationCardComponent } from './recommendation-card.component';
import { Recomendacion } from '@app/models/recomendacion.model';
import { By } from '@angular/platform-browser';

describe('RecommendationCardComponent', () => {
  let component: RecommendationCardComponent;
  let fixture: ComponentFixture<RecommendationCardComponent>;

  const mockRecomendacion: Recomendacion = {
    id: 1,
    usuario: {
      id: 1,
      nombre: 'Test User',
      email: 'test@test.com',
      contrasena: '123456',
      rol: 'usuario',
      fechaRegistro: new Date('2024-01-01'),
      lecturas: [],
      foros: [],
      mensajes: [],
      eventos: [],
      recomendacions: [],
      inscripcions: []
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
    comentario: 'Test recommendation comment',
    fecha: new Date('2024-03-15')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecommendationCardComponent, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(RecommendationCardComponent);
    component = fixture.componentInstance;
    component.recomendacion = mockRecomendacion;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display book title and author', () => {
    const titleElement = fixture.debugElement.query(By.css('h3'));
    const authorElement = fixture.debugElement.query(By.css('.text-gray-500'));

    expect(titleElement.nativeElement.textContent).toContain('Test Book');
    expect(authorElement.nativeElement.textContent).toContain('Test Author');
  });

  it('should display recommendation comment', () => {
    const commentElement = fixture.debugElement.query(By.css('.text-gray-700'));
    expect(commentElement.nativeElement.textContent).toBe('Test recommendation comment');
  });

  it('should display recommender name and date', () => {
    const metaElements = fixture.debugElement.queryAll(By.css('.text-gray-600 span'));
    
    expect(metaElements[0].nativeElement.textContent).toContain('Test User');
    expect(metaElements[1].nativeElement.textContent).toContain('15/03/2024');
  });

  it('should have correct book link', () => {
    const linkElement = fixture.debugElement.query(By.css('a[routerLink]'));
    
    expect(linkElement.attributes['ng-reflect-router-link']).toBe('1');
    expect(linkElement.nativeElement.textContent.trim()).toBe('Ver libro');
  });

  it('should have hover styles', () => {
    const cardElement = fixture.debugElement.query(By.css('.recommendation-card'));
    
    expect(getComputedStyle(cardElement.nativeElement).transition).toContain('all');
  });
}); 