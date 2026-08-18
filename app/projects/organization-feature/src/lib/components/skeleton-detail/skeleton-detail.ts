import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
	selector: 'lib-skeleton-detail',
	standalone: true,
	templateUrl: './skeleton-detail.html',
	changeDetection: ChangeDetectionStrategy.Eager,
	styleUrl: './skeleton-detail.scss',
})
export class SkeletonDetailComponent {}
