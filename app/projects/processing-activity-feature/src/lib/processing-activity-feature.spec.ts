import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessingActivityFeature } from './processing-activity-feature';

describe('ProcessingActivityFeature', () => {
	let component: ProcessingActivityFeature;
	let fixture: ComponentFixture<ProcessingActivityFeature>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ProcessingActivityFeature],
		}).compileComponents();

		fixture = TestBed.createComponent(ProcessingActivityFeature);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
