import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { PersonDetail } from './person-detail';
import { ActivatedRoute } from '@angular/router';

describe('PersonDetail', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonDetail],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: new Map([['id', 'new']]) } },
        },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(PersonDetail);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should set isNew to true when id is "new"', () => {
    const fixture = TestBed.createComponent(PersonDetail);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.isNew).toBe(true);
  });
});
