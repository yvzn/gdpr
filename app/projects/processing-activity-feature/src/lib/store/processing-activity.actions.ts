import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CreateProcessingActivityPayload, ProcessingActivity } from '../models/processing-activity.model';

export const ProcessingActivityActions = createActionGroup({
	source: 'Processing Activity',
	events: {
		'Load Activities': emptyProps(),
		'Load Activities Success': props<{ activities: ProcessingActivity[] }>(),
		'Load Activities Failure': props<{ error: string }>(),

		'Create Activity': props<{ payload: CreateProcessingActivityPayload }>(),
		'Create Activity Success': emptyProps(),
		'Create Activity Failure': props<{ error: string }>(),

		'Set Filter': props<{ filter: string }>(),
		'Set Page': props<{ page: number }>(),
		'Clear Error': emptyProps(),
	},
});
