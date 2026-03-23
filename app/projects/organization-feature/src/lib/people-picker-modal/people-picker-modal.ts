import { Component, computed, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PeopleStore } from '../people.store';
import { Person } from '../models';

@Component({
  selector: 'lib-people-picker-modal',
  imports: [FormsModule],
  templateUrl: './people-picker-modal.html',
})
export class PeoplePickerModal {
  readonly personSelected = output<Person>();
  readonly closed = output<void>();

  private readonly peopleStore = inject(PeopleStore);

  readonly searchTerm = signal('');

  filteredPeople = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const people = this.peopleStore.people();
    if (!term) return people;
    return people.filter(
      (p) =>
        p.fullName?.toLowerCase().includes(term) ||
        p.email?.toLowerCase().includes(term) ||
        p.company?.toLowerCase().includes(term)
    );
  });

  selectPerson(person: Person): void {
    this.personSelected.emit(person);
  }

  close(): void {
    this.closed.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('fixed')) {
      this.close();
    }
  }
}
