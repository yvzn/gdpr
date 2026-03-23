import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { PeoplePickerModal } from './people-picker-modal';

describe('PeoplePickerModal', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeoplePickerModal],
      providers: [provideHttpClient()],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(PeoplePickerModal);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
