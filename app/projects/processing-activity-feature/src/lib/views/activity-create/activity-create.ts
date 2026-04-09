import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import {
	MatCard,
	MatCardContent,
	MatCardHeader,
	MatCardTitle,
	MatCardActions,
} from '@angular/material/card';
import { MatError, MatFormField, MatLabel, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import { Store } from '@ngrx/store';

import { ProcessingActivityActions } from '../../store/processing-activity.actions';
import { selectSaving, selectError } from '../../store/processing-activity.selectors';
import { ErrorBannerComponent } from '../../components/error-banner/error-banner';

@Component({
	selector: 'lib-activity-create',
	standalone: true,
	imports: [
		RouterLink,
		ReactiveFormsModule,
		MatCard,
		MatCardContent,
		MatCardHeader,
		MatCardTitle,
		MatCardActions,
		MatFormField,
		MatLabel,
		MatHint,
		MatError,
		MatInput,
		MatButton,
		MatIcon,
		MatProgressBar,
		ErrorBannerComponent,
	],
	templateUrl: './activity-create.html',
	styleUrl: './activity-create.scss',
})
export class ActivityCreateComponent {
	private readonly store = inject(Store);
	private readonly fb = inject(FormBuilder);

	readonly saving = this.store.selectSignal(selectSaving);
	readonly error = this.store.selectSignal(selectError);

	readonly activityForm = this.fb.group({
		description: ['', [Validators.required, Validators.maxLength(500)]],
		reference: ['', [Validators.maxLength(100)]],
	});

	onSubmit() {
		if (this.activityForm.invalid) {
			this.activityForm.markAllAsTouched();
			return;
		}

		const { description, reference } = this.activityForm.getRawValue();
		this.store.dispatch(
			ProcessingActivityActions.createActivity({
				payload: {
					description: description || null,
					reference: reference || null,
				},
			}),
		);
	}

	retry() {
		this.store.dispatch(ProcessingActivityActions.clearError());
	}
}
