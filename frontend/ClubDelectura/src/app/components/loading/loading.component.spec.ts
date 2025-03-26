import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingComponent } from './loading.component';

describe('LoadingComponent', () => {
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingComponent]
    }).compileComponents();
    
    fixture = TestBed.createComponent(LoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display loading spinner', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.spinner-border')).toBeTruthy();
  });

  it('should display loading text', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.loading-text').textContent).toBe('Cargando...');
  });
}); 