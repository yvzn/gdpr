import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { OrganizationList } from './organization-list';

describe('OrganizationList', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizationList],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(OrganizationList);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
