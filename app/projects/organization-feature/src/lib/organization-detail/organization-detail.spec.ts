import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { OrganizationDetail } from './organization-detail';
import { ActivatedRoute } from '@angular/router';

describe('OrganizationDetail', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizationDetail],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: new Map([['id', '1']]) } },
        },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(OrganizationDetail);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
