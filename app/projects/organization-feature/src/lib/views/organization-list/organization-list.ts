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
import { MatButton } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

import { OrganizationStore } from '../../store/organization.store';
import { SkeletonCardComponent } from '../../components/skeleton-card/skeleton-card';
import { ErrorBannerComponent } from '../../components/error-banner/error-banner';

@Component({
	selector: 'lib-organization-list',
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
		FormsModule,
		SkeletonCardComponent,
		ErrorBannerComponent,
	],
	templateUrl: './organization-list.html',
	styleUrl: './organization-list.scss',
})
export class OrganizationListComponent {
	readonly store = inject(OrganizationStore);
	readonly unnamedOrg = $localize`:@@org.unnamed:Unnamed Organization`;

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
