import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { PeopleList } from './people-list';

describe('PeopleList', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeopleList],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(PeopleList);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
