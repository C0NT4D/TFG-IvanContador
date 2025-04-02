import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListadoComponent } from './listado.component';
import { RouterTestingModule } from '@angular/router/testing';
import { UsuarioService } from '../../../services/usuario.service';
import { of, throwError } from 'rxjs';
import { UserCardComponent } from '../../../components/user-card/user-card.component';

describe('ListadoComponent', () => {
  let component: ListadoComponent;
  let fixture: ComponentFixture<ListadoComponent>;
  let usuarioService: jasmine.SpyObj<UsuarioService>;

  const mockUsuarios = [
    {
      id: 1,
      nombre: 'Test User 1',
      email: 'test1@example.com',
      rol: 'usuario',
      fechaRegistro: '2024-01-01',
      lecturas: [],
      foros: [],
      eventos: [],
      mensajes: [],
      inscripcions: [],
      recomendacions: []
    },
    {
      id: 2,
      nombre: 'Test User 2',
      email: 'test2@example.com',
      rol: 'admin',
      fechaRegistro: '2024-01-02',
      lecturas: [],
      foros: [],
      eventos: [],
      mensajes: [],
      inscripcions: [],
      recomendacions: []
    }
  ];

  beforeEach(async () => {
    const usuarioServiceSpy = jasmine.createSpyObj('UsuarioService', ['getUsuarios']);
    
    await TestBed.configureTestingModule({
      imports: [ListadoComponent, RouterTestingModule, UserCardComponent],
      providers: [
        { provide: UsuarioService, useValue: usuarioServiceSpy }
      ]
    }).compileComponents();
    
    fixture = TestBed.createComponent(ListadoComponent);
    component = fixture.componentInstance;
    usuarioService = TestBed.inject(UsuarioService) as jasmine.SpyObj<UsuarioService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    usuarioService.getUsuarios.and.returnValue(of(mockUsuarios));
    component.ngOnInit();
    
    expect(usuarioService.getUsuarios).toHaveBeenCalled();
    expect(component.usuarios).toEqual(mockUsuarios);
    expect(component.loading).toBeFalse();
    expect(component.error).toBeNull();
  });

  it('should handle error when loading users', () => {
    usuarioService.getUsuarios.and.returnValue(throwError(() => new Error('Error')));
    component.ngOnInit();
    
    expect(component.error).toBe('Error al cargar los usuarios');
    expect(component.loading).toBeFalse();
  });

  it('should display loading component while loading', () => {
    component.loading = true;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-loading')).toBeTruthy();
  });

  it('should display error component when there is an error', () => {
    component.error = 'Test error';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-error')).toBeTruthy();
  });

  it('should display user cards when users are loaded', () => {
    component.usuarios = mockUsuarios;
    component.loading = false;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    const userCards = compiled.querySelectorAll('app-user-card');
    expect(userCards.length).toBe(2);
  });
}); 