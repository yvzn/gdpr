import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
	selector: 'lib-pa-skeleton-card',
	standalone: true,
	templateUrl: './skeleton-card.html',
	changeDetection: ChangeDetectionStrategy.Eager,
	styleUrl: './skeleton-card.scss',
})
export class SkeletonCardComponent {
	count = input(3);
}
