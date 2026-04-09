import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { processingActivityFeature } from './store/processing-activity.reducer';
import { ProcessingActivityEffects } from './store/processing-activity.effects';

export const processingActivityFeatureRoutes: Routes = [
	{
		path: 'processing-activities',
		providers: [provideState(processingActivityFeature), provideEffects(ProcessingActivityEffects)],
		children: [
			{
				path: '',
				loadComponent: () =>
					import('./views/activity-list/activity-list').then((m) => m.ActivityListComponent),
			},
			{
				path: 'new',
				loadComponent: () =>
					import('./views/activity-create/activity-create').then((m) => m.ActivityCreateComponent),
			},
		],
	},
];
