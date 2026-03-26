import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
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

@Component({
	selector: 'lib-person-detail',
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

	fullName = signal('');
	address = signal('');
	city = signal('');
	zipCode = signal('');
	email = signal('');
	phone = signal('');
	company = signal('');

	constructor() {
		effect(() => {
			const person = this.store.selectedPerson();
			if (person && !this.isNewMode()) {
				this.fullName.set(person.fullName ?? '');
				this.address.set(person.address ?? '');
				this.city.set(person.city ?? '');
				this.zipCode.set(person.zipCode ?? '');
				this.email.set(person.email ?? '');
				this.phone.set(person.phone ?? '');
				this.company.set(person.company ?? '');
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

	save(form: NgForm) {
		if (form.invalid) {
			form.form.markAllAsTouched();
			return;
		}
		if (this.isNewMode()) {
			const payload: CreatePersonPayload = {
				fullName: this.fullName() || null,
				address: this.address() || null,
				city: this.city() || null,
				zipCode: this.zipCode() || null,
				email: this.email() || null,
				phone: this.phone() || null,
				company: this.company() || null,
			};
			this.store.create(payload);
		} else {
			const person = this.store.selectedPerson();
			if (!person) return;

			const payload: UpdatePersonPayload = {
				id: person.id,
				fullName: this.fullName() || null,
				address: this.address() || null,
				city: this.city() || null,
				zipCode: this.zipCode() || null,
				email: this.email() || null,
				phone: this.phone() || null,
				company: this.company() || null,
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
