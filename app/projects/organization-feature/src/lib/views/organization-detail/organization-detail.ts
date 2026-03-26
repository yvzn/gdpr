import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
	MatCard,
	MatCardContent,
	MatCardHeader,
	MatCardTitle,
	MatCardActions,
} from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatProgressBar } from '@angular/material/progress-bar';

import { OrganizationStore } from '../../store/organization.store';
import { PersonStore } from '../../store/person.store';
import { SkeletonDetailComponent } from '../../components/skeleton-detail/skeleton-detail';
import { ErrorBannerComponent } from '../../components/error-banner/error-banner';
import { PeoplePickerDialogComponent } from '../../components/people-picker-dialog/people-picker-dialog';
import { Person } from '../../models/person.model';
import { UpdateOrganizationPayload } from '../../models/organization.model';

interface PersonRole {
	label: string;
	field:
		| 'controllerId'
		| 'jointControllerId'
		| 'controllersRepresentativeId'
		| 'dataProtectionOfficerId';
}

@Component({
	selector: 'lib-organization-detail',
	standalone: true,
	imports: [
		RouterLink,
		FormsModule,
		MatCard,
		MatCardContent,
		MatCardHeader,
		MatCardTitle,
		MatCardActions,
		MatFormField,
		MatLabel,
		MatInput,
		MatButton,
		MatIconButton,
		MatIcon,
		MatDivider,
		MatProgressBar,
		SkeletonDetailComponent,
		ErrorBannerComponent,
	],
	templateUrl: './organization-detail.html',
	styleUrl: './organization-detail.scss',
})
export class OrganizationDetailComponent {
	readonly store = inject(OrganizationStore);
	readonly personStore = inject(PersonStore);
	private readonly route = inject(ActivatedRoute);
	private readonly snackBar = inject(MatSnackBar);
	private readonly dialog = inject(MatDialog);

	name = signal<string>('');
	controllerId = signal<number | null>(null);
	jointControllerId = signal<number | null>(null);
	controllersRepresentativeId = signal<number | null>(null);
	dataProtectionOfficerId = signal<number | null>(null);

	readonly personRoles: PersonRole[] = [
		{ label: 'Controller', field: 'controllerId' },
		{ label: 'Joint Controller', field: 'jointControllerId' },
		{ label: "Controller's Representative", field: 'controllersRepresentativeId' },
		{ label: 'Data Protection Officer', field: 'dataProtectionOfficerId' },
	];

	constructor() {
		const id = Number(this.route.snapshot.paramMap.get('id'));
		if (id) {
			this.store.loadById(id);
		}

		effect(() => {
			const org = this.store.selectedOrganization();
			if (org) {
				this.name.set(org.name ?? '');
				this.controllerId.set(org.controllerId);
				this.jointControllerId.set(org.jointControllerId);
				this.controllersRepresentativeId.set(org.controllersRepresentativeId);
				this.dataProtectionOfficerId.set(org.dataProtectionOfficerId);
			}
		});

		// Show success snackbar when save completes
		let wasSaving = false;
		effect(() => {
			const saving = this.store.saving();
			const error = this.store.error();
			if (wasSaving && !saving && !error) {
				this.snackBar.open('Organization updated successfully.', 'Dismiss');
			}
			wasSaving = saving;
		});
	}

	getPersonIdForRole(role: PersonRole): number | null {
		switch (role.field) {
			case 'controllerId':
				return this.controllerId();
			case 'jointControllerId':
				return this.jointControllerId();
			case 'controllersRepresentativeId':
				return this.controllersRepresentativeId();
			case 'dataProtectionOfficerId':
				return this.dataProtectionOfficerId();
		}
	}

	getPersonNameForRole(role: PersonRole): string | null {
		const personId = this.getPersonIdForRole(role);
		if (!personId) return null;
		const person = this.personStore.people().find((p) => p.id === personId);
		return person?.fullName ?? `Person #${personId}`;
	}

	openPersonPicker(role: PersonRole) {
		const dialogRef = this.dialog.open(PeoplePickerDialogComponent, {
			width: '500px',
			data: { currentPersonId: this.getPersonIdForRole(role), roleLabel: role.label },
			ariaLabel: `Select ${role.label}`,
		});

		dialogRef.afterClosed().subscribe((result: Person | null | undefined) => {
			if (result !== undefined) {
				const newId = result?.id ?? null;
				switch (role.field) {
					case 'controllerId':
						this.controllerId.set(newId);
						break;
					case 'jointControllerId':
						this.jointControllerId.set(newId);
						break;
					case 'controllersRepresentativeId':
						this.controllersRepresentativeId.set(newId);
						break;
					case 'dataProtectionOfficerId':
						this.dataProtectionOfficerId.set(newId);
						break;
				}
			}
		});
	}

	clearPersonForRole(role: PersonRole) {
		switch (role.field) {
			case 'controllerId':
				this.controllerId.set(null);
				break;
			case 'jointControllerId':
				this.jointControllerId.set(null);
				break;
			case 'controllersRepresentativeId':
				this.controllersRepresentativeId.set(null);
				break;
			case 'dataProtectionOfficerId':
				this.dataProtectionOfficerId.set(null);
				break;
		}
	}

	save() {
		const org = this.store.selectedOrganization();
		if (!org) return;

		const payload: UpdateOrganizationPayload = {
			id: org.id,
			name: this.name() || null,
			controllerId: this.controllerId(),
			jointControllerId: this.jointControllerId(),
			controllersRepresentativeId: this.controllersRepresentativeId(),
			dataProtectionOfficerId: this.dataProtectionOfficerId(),
		};

		this.store.update(payload);
	}

	retry() {
		this.store.clearError();
		const id = Number(this.route.snapshot.paramMap.get('id'));
		if (id) {
			this.store.loadById(id);
		}
	}
}
