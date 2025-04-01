import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RecomendacionFormComponent } from './recomendacion-form.component';

describe('RecomendacionFormComponent', () => {
  let component: RecomendacionFormComponent;
  let fixture: ComponentFixture<RecomendacionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecomendacionFormComponent, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(RecomendacionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.recomendacionForm.get('titulo')?.value).toBe('');
    expect(component.recomendacionForm.get('autor')?.value).toBe('');
    expect(component.recomendacionForm.get('genero')?.value).toBe('');
    expect(component.recomendacionForm.get('descripcion')?.value).toBe('');
    expect(component.recomendacionForm.get('razonRecomendacion')?.value).toBe('');
  });

  it('should be invalid when empty', () => {
    expect(component.recomendacionForm.valid).toBeFalsy();
  });

  it('should be valid when all fields are filled', () => {
    component.recomendacionForm.patchValue({
      titulo: 'Test Book',
      autor: 'Test Author',
      genero: 'Test Genre',
      descripcion: 'Test Description',
      razonRecomendacion: 'Test Reason'
    });

    expect(component.recomendacionForm.valid).toBeTruthy();
  });

  it('should emit closeForm event when onCancel is called', () => {
    const spy = jest.spyOn(component.closeForm, 'emit');
    component.onCancel();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit closeForm event when form is submitted', () => {
    const spy = jest.spyOn(component.closeForm, 'emit');
    component.recomendacionForm.patchValue({
      titulo: 'Test Book',
      autor: 'Test Author',
      genero: 'Test Genre',
      descripcion: 'Test Description',
      razonRecomendacion: 'Test Reason'
    });

    component.onSubmit();
    expect(spy).toHaveBeenCalled();
  });
}); 