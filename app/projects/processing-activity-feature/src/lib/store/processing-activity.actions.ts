import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
	CreateProcessingActivityPayload,
	ProcessingActivity,
	ProcessingActivityDetail,
	UpdateProcessingActivityPayload,
} from '../models/processing-activity.model';

export const ProcessingActivityActions = createActionGroup({
	source: 'Processing Activity',
	events: {
		'Load Activities': emptyProps(),
		'Load Activities Success': props<{ activities: ProcessingActivity[] }>(),
		'Load Activities Failure': props<{ error: string }>(),

		'Load Activity': props<{ id: number }>(),
		'Load Activity Success': props<{ activity: ProcessingActivityDetail }>(),
		'Load Activity Failure': props<{ error: string }>(),

		'Create Activity': props<{ payload: CreateProcessingActivityPayload }>(),
		'Create Activity Success': emptyProps(),
		'Create Activity Failure': props<{ error: string }>(),

		'Update Activity': props<{ payload: UpdateProcessingActivityPayload }>(),
		'Update Activity Success': emptyProps(),
		'Update Activity Failure': props<{ error: string }>(),

		'Set Filter': props<{ filter: string }>(),
		'Set Page': props<{ page: number }>(),
		'Clear Error': emptyProps(),
	},
});
