import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ProcessingActivityService } from '../services/processing-activity.service';
import { ProcessingActivityActions } from './processing-activity.actions';

@Injectable()
export class ProcessingActivityEffects {
	private readonly actions$ = inject(Actions);
	private readonly service = inject(ProcessingActivityService);
	private readonly router = inject(Router);
	private readonly snackBar = inject(MatSnackBar);

	loadActivities$ = createEffect(() =>
		this.actions$.pipe(
			ofType(ProcessingActivityActions.loadActivities),
			switchMap(() =>
				this.service.getAll().pipe(
					map((response) =>
						ProcessingActivityActions.loadActivitiesSuccess({
							activities: response.processingActivities,
						}),
					),
					catchError(() =>
						of(
							ProcessingActivityActions.loadActivitiesFailure({
								error: $localize`:@@pa.error.loadAll:Failed to load processing activities.`,
							}),
						),
					),
				),
			),
		),
	);

	createActivity$ = createEffect(() =>
		this.actions$.pipe(
			ofType(ProcessingActivityActions.createActivity),
			exhaustMap(({ payload }) =>
				this.service.create(payload).pipe(
					map(() => ProcessingActivityActions.createActivitySuccess()),
					catchError(() =>
						of(
							ProcessingActivityActions.createActivityFailure({
								error: $localize`:@@pa.error.create:Failed to create processing activity.`,
							}),
						),
					),
				),
			),
		),
	);

	createActivitySuccess$ = createEffect(
		() =>
			this.actions$.pipe(
				ofType(ProcessingActivityActions.createActivitySuccess),
				tap(() => {
					this.snackBar.open(
						$localize`:@@pa.create.success:Processing activity created successfully.`,
						$localize`:@@common.dismiss:Dismiss`,
					);
					this.router.navigate(['/processing-activities']);
				}),
			),
		{ dispatch: false },
	);

	reloadAfterCreate$ = createEffect(() =>
		this.actions$.pipe(
			ofType(ProcessingActivityActions.createActivitySuccess),
			map(() => ProcessingActivityActions.loadActivities()),
		),
	);

	loadActivity$ = createEffect(() =>
		this.actions$.pipe(
			ofType(ProcessingActivityActions.loadActivity),
			switchMap(({ id }) =>
				this.service.getById(id).pipe(
					map((activity) => ProcessingActivityActions.loadActivitySuccess({ activity })),
					catchError(() =>
						of(
							ProcessingActivityActions.loadActivityFailure({
								error: $localize`:@@pa.error.load:Failed to load processing activity.`,
							}),
						),
					),
				),
			),
		),
	);

	updateActivity$ = createEffect(() =>
		this.actions$.pipe(
			ofType(ProcessingActivityActions.updateActivity),
			exhaustMap(({ payload }) =>
				this.service.update(payload).pipe(
					map(() => ProcessingActivityActions.updateActivitySuccess()),
					catchError(() =>
						of(
							ProcessingActivityActions.updateActivityFailure({
								error: $localize`:@@pa.error.update:Failed to update processing activity.`,
							}),
						),
					),
				),
			),
		),
	);

	updateActivitySuccess$ = createEffect(
		() =>
			this.actions$.pipe(
				ofType(ProcessingActivityActions.updateActivitySuccess),
				tap(() => {
					this.snackBar.open(
						$localize`:@@pa.edit.success:Processing activity updated successfully.`,
						$localize`:@@common.dismiss:Dismiss`,
					);
					this.router.navigate(['/processing-activities']);
				}),
			),
		{ dispatch: false },
	);

	reloadAfterUpdate$ = createEffect(() =>
		this.actions$.pipe(
			ofType(ProcessingActivityActions.updateActivitySuccess),
			map(() => ProcessingActivityActions.loadActivities()),
		),
	);
}
