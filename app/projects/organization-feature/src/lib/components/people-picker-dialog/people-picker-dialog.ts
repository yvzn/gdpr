import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	MAT_DIALOG_DATA,
	MatDialogRef,
	MatDialogTitle,
	MatDialogContent,
	MatDialogActions,
} from '@angular/material/dialog';
import { MatFormField, MatLabel, MatPrefix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';

import { PersonStore } from '../../store/person.store';
import { Person } from '../../models/person.model';

interface PeoplePickerDialogData {
	currentPersonId: number | null;
	roleLabel: string;
}

@Component({
	selector: 'lib-people-picker-dialog',
	standalone: true,
	imports: [
		FormsModule,
		MatDialogTitle,
		MatDialogContent,
		MatDialogActions,
		MatFormField,
		MatLabel,
		MatPrefix,
		MatInput,
		MatIcon,
		MatButton,
	],
	templateUrl: './people-picker-dialog.html',
	styleUrl: './people-picker-dialog.scss',
})
export class PeoplePickerDialogComponent implements OnInit {
	private readonly dialogRef = inject(MatDialogRef<PeoplePickerDialogComponent>);
	readonly data = inject<PeoplePickerDialogData>(MAT_DIALOG_DATA);
	readonly personStore = inject(PersonStore);

	searchTerm = signal('');
	selectedPerson = signal<Person | null>(null);

	filteredPeople = computed(() => {
		const term = this.searchTerm().toLowerCase();
		const people = this.personStore.people();
		if (!term) return people;
		return people.filter(
			(p) =>
				p.fullName?.toLowerCase().includes(term) ||
				p.email?.toLowerCase().includes(term) ||
				p.company?.toLowerCase().includes(term),
		);
	});

	ngOnInit() {
		if (this.data.currentPersonId) {
			const person = this.personStore.people().find((p) => p.id === this.data.currentPersonId);
			if (person) {
				this.selectedPerson.set(person);
			}
		}
	}

	selectPerson(person: Person) {
		this.selectedPerson.set(person);
	}

	isSelected(person: Person): boolean {
		return this.selectedPerson()?.id === person.id;
	}

	confirm() {
		this.dialogRef.close(this.selectedPerson());
	}

	clear() {
		this.dialogRef.close(null);
	}

	cancel() {
		this.dialogRef.close(undefined);
	}
}
