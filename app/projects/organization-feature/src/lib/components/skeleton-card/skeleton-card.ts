import { Component, input } from '@angular/core';

@Component({
	selector: 'lib-skeleton-card',
	standalone: true,
	templateUrl: './skeleton-card.html',
	styleUrl: './skeleton-card.scss',
})
export class SkeletonCardComponent {
	count = input(3);
}
