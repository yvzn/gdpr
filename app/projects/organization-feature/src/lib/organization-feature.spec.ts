import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationFeature } from './organization-feature';

describe('OrganizationFeature', () => {
  let component: OrganizationFeature;
  let fixture: ComponentFixture<OrganizationFeature>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizationFeature]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizationFeature);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
