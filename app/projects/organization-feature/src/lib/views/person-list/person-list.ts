import { Component, inject } from '@angular/core';
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
import { FormsModule } from '@angular/forms';

import { PersonStore } from '../../store/person.store';
import { SkeletonCardComponent } from '../../components/skeleton-card/skeleton-card';
import { ErrorBannerComponent } from '../../components/error-banner/error-banner';

@Component({
	selector: 'lib-person-list',
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
		FormsModule,
		SkeletonCardComponent,
		ErrorBannerComponent,
	],
	templateUrl: './person-list.html',
	styleUrl: './person-list.scss',
})
export class PersonListComponent {
	readonly store = inject(PersonStore);
	readonly unnamedPerson = $localize`:@@person.unnamed:Unnamed Person`;

	onFilterChange(value: string) {
		this.store.setFilter(value);
	}

	onPageChange(event: PageEvent) {
		this.store.setPage(event.pageIndex);
	}

	retry() {
		this.store.clearError();
		this.store.loadAll();
	}
}
