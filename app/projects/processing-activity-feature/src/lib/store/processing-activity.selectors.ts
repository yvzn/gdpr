import { createSelector } from '@ngrx/store';
import { processingActivityFeature } from './processing-activity.reducer';

export const {
	selectActivities,
	selectLoading,
	selectSaving,
	selectError,
	selectFilter,
	selectPage,
	selectPageSize,
} = processingActivityFeature;

export const selectFilteredActivities = createSelector(
	selectActivities,
	selectFilter,
	(activities, filter) => {
		const term = filter.toLowerCase();
		if (!term) return activities;
		return activities.filter(
			(a) =>
				a.description?.toLowerCase().includes(term) ||
				a.reference?.toLowerCase().includes(term),
		);
	},
);

export const selectTotalFilteredCount = createSelector(
	selectFilteredActivities,
	(activities) => activities.length,
);

export const selectPaginatedActivities = createSelector(
	selectFilteredActivities,
	selectPage,
	selectPageSize,
	(activities, page, pageSize) => {
		const start = page * pageSize;
		return activities.slice(start, start + pageSize);
	},
);
