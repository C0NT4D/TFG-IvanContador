import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorComponent } from './error.component';

describe('ErrorComponent', () => {
  let component: ErrorComponent;
  let fixture: ComponentFixture<ErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorComponent]
    }).compileComponents();
    
    fixture = TestBed.createComponent(ErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display default error message', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.error-message').textContent).toBe('Ha ocurrido un error');
  });

  it('should display custom error message', () => {
    component.message = 'Error personalizado';
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.error-message').textContent).toBe('Error personalizado');
  });

  it('should show retry button by default', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.retry-button')).toBeTruthy();
  });

  it('should hide retry button when showRetry is false', () => {
    component.showRetry = false;
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.retry-button')).toBeFalsy();
  });

  it('should call reload method when retry button is clicked', () => {
    const spy = spyOn(component, 'reload');
    const compiled = fixture.nativeElement;
    compiled.querySelector('.retry-button').click();
    expect(spy).toHaveBeenCalled();
  });
}); 