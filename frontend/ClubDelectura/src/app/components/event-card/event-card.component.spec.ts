import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventCardComponent } from './event-card.component';
import { Evento } from '../../models/evento.model';

describe('EventCardComponent', () => {
  let component: EventCardComponent;
  let fixture: ComponentFixture<EventCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventCardComponent]
    }).compileComponents();
    
    fixture = TestBed.createComponent(EventCardComponent);
    component = fixture.componentInstance;
    
   
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display event title', () => {
    const titleElement = fixture.nativeElement.querySelector('h3');
    expect(titleElement.textContent).toContain('Test Event');
  });

  it('should display event description', () => {
    const descriptionElement = fixture.nativeElement.querySelector('.event-description');
    expect(descriptionElement.textContent).toContain('Test Description');
  });

  it('should display event location', () => {
    const locationElement = fixture.nativeElement.querySelector('.event-location span');
    expect(locationElement.textContent).toContain('Test Location');
  });

  it('should display correct number of participants', () => {
    const participantsElement = fixture.nativeElement.querySelector('.event-participants span');
    expect(participantsElement.textContent).toContain('0 participantes');
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