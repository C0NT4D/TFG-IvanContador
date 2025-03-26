import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InscriptionCardComponent } from './inscription-card.component';
import { Inscripcion } from '../../models/inscripcion.model';

describe('InscriptionCardComponent', () => {
  let component: InscriptionCardComponent;
  let fixture: ComponentFixture<InscriptionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InscriptionCardComponent]
    }).compileComponents();
    
    fixture = TestBed.createComponent(InscriptionCardComponent);
    component = fixture.componentInstance;
    
    // Mock inscription data
    component.inscription = {
      id: 1,
      estado: 'CONFIRMADA',
      fechaInscripcion: new Date(),
      evento: {
        id: 1,
        titulo: 'Test Event',
        fecha: new Date(),
        descripcion: 'Test Description',
        ubicacion: 'Test Location',
        organizador: {
          id: 1,
          nombre: 'Test Organizer'
        },
        inscripcions: []
      },
      usuario: {
        id: 1,
        nombre: 'Test User'
      }
    };
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display event title', () => {
    const titleElement = fixture.nativeElement.querySelector('h3');
    expect(titleElement.textContent).toContain('Test Event');
  });

  it('should display inscription status', () => {
    const statusElement = fixture.nativeElement.querySelector('.inscription-status');
    expect(statusElement.textContent).toContain('CONFIRMADA');
  });

  it('should display user name', () => {
    const userElement = fixture.nativeElement.querySelector('.inscription-user span');
    expect(userElement.textContent).toContain('Test User');
  });

  it('should show details button when showDetails is true', () => {
    component.showDetails = true;
    fixture.detectChanges();
    
    const detailsButton = fixture.nativeElement.querySelector('.btn-primary');
    expect(detailsButton).toBeTruthy();
  });

  it('should hide details button when showDetails is false', () => {
    component.showDetails = false;
    fixture.detectChanges();
    
    const detailsButton = fixture.nativeElement.querySelector('.btn-primary');
    expect(detailsButton).toBeFalsy();
  });
}); 