import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForumCardComponent } from './forum-card.component';
import { Foro } from '../../models/foro.model';

describe('ForumCardComponent', () => {
  let component: ForumCardComponent;
  let fixture: ComponentFixture<ForumCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForumCardComponent]
    }).compileComponents();
    
    fixture = TestBed.createComponent(ForumCardComponent);
    component = fixture.componentInstance;
    
   
    
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display forum title', () => {
    const titleElement = fixture.nativeElement.querySelector('h3');
    expect(titleElement.textContent).toContain('Test Forum');
  });

  it('should display forum description', () => {
    const descriptionElement = fixture.nativeElement.querySelector('.forum-description');
    expect(descriptionElement.textContent).toContain('Test Description');
  });

  it('should display creator name', () => {
    const authorElement = fixture.nativeElement.querySelector('.forum-author');
    expect(authorElement.textContent).toContain('Test User');
  });
}); 