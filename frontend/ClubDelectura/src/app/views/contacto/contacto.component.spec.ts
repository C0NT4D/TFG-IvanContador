import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ContactoComponent } from './contacto.component';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';


describe('ContactoComponent', () => {
  let component: ContactoComponent;
  let fixture: ComponentFixture<ContactoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Importar el componente standalone y los módulos necesarios
      imports: [
        ContactoComponent, 
        ReactiveFormsModule, 
        CommonModule, 
        RouterTestingModule 
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContactoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create the contact form on init', () => {
    expect(component.contactForm).toBeDefined();
    expect(component.contactForm.controls['nombre']).toBeDefined();
    expect(component.contactForm.controls['email']).toBeDefined();
    expect(component.contactForm.controls['asunto']).toBeDefined();
    expect(component.contactForm.controls['mensaje']).toBeDefined();
  });

  it('should make the nombre control required', () => {
    let control = component.contactForm.controls['nombre'];
    control.setValue('');
    expect(control.valid).toBeFalsy();
  });

  it('should make the email control required and validate email format', () => {
    let control = component.contactForm.controls['email'];
    control.setValue('');
    expect(control.valid).toBeFalsy();
    control.setValue('not-an-email');
    expect(control.valid).toBeFalsy();
    control.setValue('test@example.com');
    expect(control.valid).toBeTruthy();
  });

  // Añadir más pruebas para otros campos y el método onSubmit si es necesario
}); 