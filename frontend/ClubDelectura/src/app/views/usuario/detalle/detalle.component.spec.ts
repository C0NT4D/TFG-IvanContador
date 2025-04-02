import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleComponent } from './detalle.component';
import { RouterTestingModule } from '@angular/router/testing';
import { UsuarioService } from '../../../services/usuario.service';
import { of, throwError } from 'rxjs';

describe('DetalleComponent', () => {
  let component: DetalleComponent;
  let fixture: ComponentFixture<DetalleComponent>;
  let usuarioService: jasmine.SpyObj<UsuarioService>;

  const mockUsuario = {
    id: 1,
    nombre: 'Test User',
    email: 'test@example.com',
    rol: 'usuario',
    fechaRegistro: '2024-01-01',
    lecturas: [],
    foros: [],
    eventos: [],
    mensajes: [],
    inscripcions: [],
    recomendacions: []
  };

  beforeEach(async () => {
    const usuarioServiceSpy = jasmine.createSpyObj('UsuarioService', ['getUsuario', 'deleteUsuario']);
    
    await TestBed.configureTestingModule({
      imports: [DetalleComponent, RouterTestingModule],
      providers: [
        { provide: UsuarioService, useValue: usuarioServiceSpy }
      ]
    }).compileComponents();
    
    fixture = TestBed.createComponent(DetalleComponent);
    component = fixture.componentInstance;
    usuarioService = TestBed.inject(UsuarioService) as jasmine.SpyObj<UsuarioService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user data on init', () => {
    usuarioService.getUsuario.and.returnValue(of(mockUsuario));
    component.ngOnInit();
    
    expect(usuarioService.getUsuario).toHaveBeenCalledWith(1);
    expect(component.usuario).toEqual(mockUsuario);
    expect(component.loading).toBeFalse();
    expect(component.error).toBeNull();
  });

  it('should handle error when loading user data', () => {
    usuarioService.getUsuario.and.returnValue(throwError(() => new Error('Error')));
    component.ngOnInit();
    
    expect(component.error).toBe('Error al cargar los datos del usuario');
    expect(component.loading).toBeFalse();
  });

  it('should show delete modal when openDeleteModal is called', () => {
    component.openDeleteModal();
    expect(component.showDeleteModal).toBeTrue();
  });

  it('should hide delete modal when closeDeleteModal is called', () => {
    component.showDeleteModal = true;
    component.closeDeleteModal();
    expect(component.showDeleteModal).toBeFalse();
  });

  it('should delete user and navigate to users list when confirmDelete is called', () => {
    component.usuario = mockUsuario;
    usuarioService.deleteUsuario.and.returnValue(of({}));
    spyOn(component['router'], 'navigate');
    
    component.confirmDelete();
    
    expect(usuarioService.deleteUsuario).toHaveBeenCalledWith(1);
    expect(component['router'].navigate).toHaveBeenCalledWith(['/usuarios']);
    expect(component.showDeleteModal).toBeFalse();
  });

  it('should handle error when deleting user', () => {
    component.usuario = mockUsuario;
    usuarioService.deleteUsuario.and.returnValue(throwError(() => new Error('Error')));
    
    component.confirmDelete();
    
    expect(component.error).toBe('Error al eliminar el usuario');
    expect(component.loading).toBeFalse();
  });
}); 