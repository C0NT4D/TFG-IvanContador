import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { UserFormComponent } from './user-form.component';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule
      ],
      declarations: []
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with login mode by default', () => {
    expect(component.mode).toBe('login');
  });

  it('should initialize form with empty values', () => {
    expect(component.userForm.get('email')?.value).toBe('');
    expect(component.userForm.get('contrasena')?.value).toBe('');
    expect(component.userForm.get('nombre')?.value).toBe('');
  });

  it('should have email and password fields in login mode', () => {
    component.mode = 'login';
    fixture.detectChanges();
    
    const formControls = Object.keys(component.userForm.controls);
    expect(formControls).toContain('email');
    expect(formControls).toContain('contrasena');
    expect(formControls).toContain('nombre');
    
    expect(component.userForm.get('nombre')?.hasValidator).toBeFalsy();
  });

  it('should have name, email and password fields in register mode', () => {
    component.mode = 'register';
    fixture.detectChanges();
    
    const formControls = Object.keys(component.userForm.controls);
    expect(formControls).toContain('nombre');
    expect(formControls).toContain('email');
    expect(formControls).toContain('contrasena');
    
    expect(component.userForm.get('nombre')?.hasValidator).toBeTruthy();
  });

  it('should validate email format', () => {
    const emailControl = component.userForm.get('email');
    
    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBeFalsy();
    
    emailControl?.setValue('valid@email.com');
    expect(emailControl?.valid).toBeTruthy();
  });

  it('should validate password length', () => {
    const passwordControl = component.userForm.get('contrasena');
    
    passwordControl?.setValue('12345'); 
    expect(passwordControl?.valid).toBeFalsy();
    
    passwordControl?.setValue('123456'); 
    expect(passwordControl?.valid).toBeTruthy();
  });

  it('should emit login data when form is valid in login mode', () => {
    spyOn(component.submitLogin, 'emit');
    component.mode = 'login';
    
    component.userForm.setValue({
      email: 'test@example.com',
      contrasena: 'password123',
      nombre: ''
    });
    
    component.onSubmit();
    
    expect(component.submitLogin.emit).toHaveBeenCalledWith({
      email: 'test@example.com',
      contrasena: 'password123'
    });
  });

  it('should emit register data when form is valid in register mode', () => {
    spyOn(component.submitRegister, 'emit');
    component.mode = 'register';
    
    component.userForm.setValue({
      email: 'test@example.com',
      contrasena: 'password123',
      nombre: 'Test User'
    });
    
    component.onSubmit();
    
    expect(component.submitRegister.emit).toHaveBeenCalledWith({
      email: 'test@example.com',
      contrasena: 'password123',
      nombre: 'Test User'
    });
  });

  it('should set error message when form is invalid', () => {
    component.userForm.setValue({
      email: 'invalid-email',
      contrasena: '12345',
      nombre: ''
    });
    
    component.onSubmit();
    
    expect(component.error).toBe('Por favor, complete todos los campos correctamente');
  });
});