import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { email, form, FormField } from '@angular/forms/signals';
import {
	MatCard,
	MatCardContent,
	MatCardHeader,
	MatCardTitle,
	MatCardActions,
} from '@angular/material/card';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressBar } from '@angular/material/progress-bar';

import { PersonStore } from '../../store/person.store';
import { SkeletonDetailComponent } from '../../components/skeleton-detail/skeleton-detail';
import { ErrorBannerComponent } from '../../components/error-banner/error-banner';
import { CreatePersonPayload, UpdatePersonPayload } from '../../models/person.model';

interface PersonDetails {
	fullName: string;
	address: string;
	city: string;
	zipCode: string;
	email: string;
	phone: string;
	company: string;
}

@Component({
	selector: 'lib-person-detail',
	standalone: true,
	imports: [
		RouterLink,
		FormField,
		MatCard,
		MatCardContent,
		MatCardHeader,
		MatCardTitle,
		MatCardActions,
		MatFormField,
		MatLabel,
		MatError,
		MatInput,
		MatButton,
		MatIcon,
		MatProgressBar,
		SkeletonDetailComponent,
		ErrorBannerComponent,
	],
	templateUrl: './person-detail.html',
	styleUrl: './person-detail.scss',
})
export class PersonDetailComponent implements OnInit {
	readonly store = inject(PersonStore);
	private readonly route = inject(ActivatedRoute);
	private readonly router = inject(Router);
	private readonly snackBar = inject(MatSnackBar);

	isNewMode = signal(false);
	readonly unnamedPerson = $localize`:@@person.unnamed:Unnamed Person`;

	personDetails = signal<PersonDetails>({
		fullName: '',
		address: '',
		city: '',
		zipCode: '',
		email: '',
		phone: '',
		company: '',
	});

	personForm = form(this.personDetails, (schemaPath) => {
		email(schemaPath.email, {
			message: $localize`:@@person.detail.emailError:Please enter a valid email address`,
		});
	});

	constructor() {
		effect(() => {
			const person = this.store.selectedPerson();
			if (person && !this.isNewMode()) {
				this.personDetails.update((details) => ({
					...details,
					fullName: person.fullName ?? '',
					address: person.address ?? '',
					city: person.city ?? '',
					zipCode: person.zipCode ?? '',
					email: person.email ?? '',
					phone: person.phone ?? '',
					company: person.company ?? '',
				}));
			}
		});

		let wasSaving = false;
		effect(() => {
			const saving = this.store.saving();
			const error = this.store.error();
			if (wasSaving && !saving && !error) {
				if (this.isNewMode()) {
					this.snackBar.open(
						$localize`:@@person.detail.createSuccess:Person created successfully.`,
						$localize`:@@common.dismiss:Dismiss`,
					);
					this.router.navigate(['/people']);
				} else {
					this.snackBar.open(
						$localize`:@@person.detail.updateSuccess:Person updated successfully.`,
						$localize`:@@common.dismiss:Dismiss`,
					);
				}
			}
			wasSaving = saving;
		});
	}

	ngOnInit() {
		const idParam = this.route.snapshot.paramMap.get('id');
		if (idParam === 'new') {
			this.isNewMode.set(true);
			this.store.clearSelectedPerson();
		} else {
			const id = Number(idParam);
			if (id) {
				this.store.loadById(id);
			}
		}
	}

	save($event: SubmitEvent) {
		$event.preventDefault();

		if (this.personForm().invalid()) {
			this.personForm().markAsTouched();
			return;
		}
		if (this.isNewMode()) {
			const payload: CreatePersonPayload = this.personDetails();
			this.store.create(payload);
		} else {
			const person = this.store.selectedPerson();
			if (!person) return;

			const payload: UpdatePersonPayload = {
				id: person.id,
				...this.personDetails(),
			};
			this.store.update(payload);
		}
	}

	retry() {
		this.store.clearError();
		const id = Number(this.route.snapshot.paramMap.get('id'));
		if (id) {
			this.store.loadById(id);
		}
	}
}
