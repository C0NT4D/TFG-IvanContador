import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDialogComponent } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent]
    }).compileComponents();
    
    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show dialog by default', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.dialog-content')).toBeFalsy();
  });

  it('should show dialog when isOpen is true', () => {
    component.isOpen = true;
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.dialog-content')).toBeTruthy();
  });

  it('should display default title and message', () => {
    component.isOpen = true;
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.dialog-title').textContent).toBe('Confirmar');
    expect(compiled.querySelector('.dialog-message').textContent).toBe('¿Estás seguro?');
  });

  it('should display custom title and message', () => {
    component.isOpen = true;
    component.title = 'Eliminar libro';
    component.message = '¿Estás seguro de que quieres eliminar este libro?';
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.dialog-title').textContent).toBe('Eliminar libro');
    expect(compiled.querySelector('.dialog-message').textContent).toBe('¿Estás seguro de que quieres eliminar este libro?');
  });

  it('should emit confirm event when confirm button is clicked', () => {
    const spy = spyOn(component.confirm, 'emit');
    component.isOpen = true;
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    compiled.querySelector('.btn-primary').click();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit cancel event when cancel button is clicked', () => {
    const spy = spyOn(component.cancel, 'emit');
    component.isOpen = true;
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    compiled.querySelector('.btn-secondary').click();
    expect(spy).toHaveBeenCalled();
  });
}); 