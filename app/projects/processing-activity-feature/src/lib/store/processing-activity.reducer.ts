import { createFeature, createReducer, on } from '@ngrx/store';
import { ProcessingActivity } from '../models/processing-activity.model';
import { ProcessingActivityActions } from './processing-activity.actions';

export interface ProcessingActivityState {
	activities: ProcessingActivity[];
	loading: boolean;
	saving: boolean;
	error: string | null;
	filter: string;
	page: number;
	pageSize: number;
}

const initialState: ProcessingActivityState = {
	activities: [],
	loading: false,
	saving: false,
	error: null,
	filter: '',
	page: 0,
	pageSize: 12,
};

export const processingActivityFeature = createFeature({
	name: 'processingActivity',
	reducer: createReducer(
		initialState,
		on(ProcessingActivityActions.loadActivities, (state) => ({
			...state,
			loading: true,
			error: null,
		})),
		on(ProcessingActivityActions.loadActivitiesSuccess, (state, { activities }) => ({
			...state,
			activities,
			loading: false,
		})),
		on(ProcessingActivityActions.loadActivitiesFailure, (state, { error }) => ({
			...state,
			loading: false,
			error,
		})),
		on(ProcessingActivityActions.createActivity, (state) => ({
			...state,
			saving: true,
			error: null,
		})),
		on(ProcessingActivityActions.createActivitySuccess, (state) => ({
			...state,
			saving: false,
		})),
		on(ProcessingActivityActions.createActivityFailure, (state, { error }) => ({
			...state,
			saving: false,
			error,
		})),
		on(ProcessingActivityActions.setFilter, (state, { filter }) => ({
			...state,
			filter,
			page: 0,
		})),
		on(ProcessingActivityActions.setPage, (state, { page }) => ({
			...state,
			page,
		})),
		on(ProcessingActivityActions.clearError, (state) => ({
			...state,
			error: null,
		})),
	),
});
