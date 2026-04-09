import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
	MatCard,
	MatCardContent,
	MatCardHeader,
	MatCardTitle,
	MatCardSubtitle,
} from '@angular/material/card';
import { MatFormField, MatLabel, MatPrefix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatButton, MatFabButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatChipSet, MatChip } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';

import { ProcessingActivityActions } from '../../store/processing-activity.actions';
import {
	selectLoading,
	selectError,
	selectFilter,
	selectPage,
	selectPageSize,
	selectPaginatedActivities,
	selectTotalFilteredCount,
} from '../../store/processing-activity.selectors';
import { SkeletonCardComponent } from '../../components/skeleton-card/skeleton-card';
import { ErrorBannerComponent } from '../../components/error-banner/error-banner';

@Component({
	selector: 'lib-activity-list',
	standalone: true,
	imports: [
		RouterLink,
		MatCard,
		MatCardContent,
		MatCardHeader,
		MatCardTitle,
		MatCardSubtitle,
		MatFormField,
		MatLabel,
		MatPrefix,
		MatInput,
		MatIcon,
		MatPaginator,
		MatButton,
		MatFabButton,
		MatTooltip,
		MatChipSet,
		MatChip,
		FormsModule,
		DatePipe,
		SkeletonCardComponent,
		ErrorBannerComponent,
	],
	templateUrl: './activity-list.html',
	styleUrl: './activity-list.scss',
})
export class ActivityListComponent implements OnInit {
	private readonly store = inject(Store);

	readonly activities = this.store.selectSignal(selectPaginatedActivities);
	readonly loading = this.store.selectSignal(selectLoading);
	readonly error = this.store.selectSignal(selectError);
	readonly filter = this.store.selectSignal(selectFilter);
	readonly page = this.store.selectSignal(selectPage);
	readonly pageSize = this.store.selectSignal(selectPageSize);
	readonly totalCount = this.store.selectSignal(selectTotalFilteredCount);

	readonly unnamedActivity = $localize`:@@pa.unnamed:Untitled Activity`;

	ngOnInit() {
		this.store.dispatch(ProcessingActivityActions.loadActivities());
	}

	onFilterChange(value: string) {
		this.store.dispatch(ProcessingActivityActions.setFilter({ filter: value }));
	}

	onPageChange(event: PageEvent) {
		this.store.dispatch(ProcessingActivityActions.setPage({ page: event.pageIndex }));
	}

	retry() {
		this.store.dispatch(ProcessingActivityActions.clearError());
		this.store.dispatch(ProcessingActivityActions.loadActivities());
	}
}
