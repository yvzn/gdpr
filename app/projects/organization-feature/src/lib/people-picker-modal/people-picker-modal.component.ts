import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Person } from '../models';
import { PeopleService } from '../people.service';

@Component({
  selector: 'lib-people-picker-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isOpen) {
    <div class="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto">
      <div class="fixed inset-0 bg-gray-900 bg-opacity-50" (click)="close()"></div>
      <div class="relative w-full max-w-lg max-h-full z-10">
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <!-- Modal header -->
          <div class="flex items-center justify-between p-4 border-b dark:border-gray-600">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">{{ title }}</h3>
            <button (click)="close()" class="text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
              </svg>
            </button>
          </div>
          <!-- Search -->
          <div class="p-4 border-b dark:border-gray-600">
            <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="onSearch()"
              placeholder="Search by name..."
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <!-- List -->
          <div class="p-4 max-h-80 overflow-y-auto">
            @if (loading) {
              <p class="text-center text-gray-500 dark:text-gray-400">Loading...</p>
            } @else if (loadError) {
              <p class="text-center text-red-600 dark:text-red-400">{{ loadError }}</p>
            } @else if (filteredPeople.length === 0) {
              <p class="text-center text-gray-500 dark:text-gray-400">No people found.</p>
            } @else {
              <ul class="space-y-2">
                @for (person of filteredPeople; track person.id) {
                  <li>
                    <button (click)="selectPerson(person)"
                      class="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors">
                      <p class="font-medium text-gray-900 dark:text-white">{{ person.fullName || '(No name)' }}</p>
                      @if (person.company) {
                        <p class="text-sm text-gray-500 dark:text-gray-400">{{ person.company }}</p>
                      }
                      @if (person.email) {
                        <p class="text-sm text-gray-500 dark:text-gray-400">{{ person.email }}</p>
                      }
                    </button>
                  </li>
                }
              </ul>
            }
          </div>
          <!-- Clear selection -->
          <div class="p-4 border-t dark:border-gray-600 flex justify-between">
            <button (click)="clearSelection()"
              class="text-red-600 hover:text-red-700 text-sm font-medium">
              Clear selection
            </button>
            <button (click)="close()"
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white text-sm font-medium">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
    }
  `
})
export class PeoplePickerModalComponent implements OnInit {
  @Input() isOpen = false;
  @Input() title = 'Select a person';
  @Output() personSelected = new EventEmitter<Person | null>();
  @Output() modalClosed = new EventEmitter<void>();

  private peopleService = inject(PeopleService);

  people: Person[] = [];
  filteredPeople: Person[] = [];
  searchQuery = '';
  loading = false;
  loadError = '';

  ngOnInit(): void {
    this.loadPeople();
  }

  private loadPeople(): void {
    this.loading = true;
    this.peopleService.getAll().subscribe({
      next: (people) => {
        this.people = people;
        this.filteredPeople = people;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.loadError = 'Failed to load people. Please try again.';
      }
    });
  }

  onSearch(): void {
    const q = this.searchQuery.toLowerCase();
    this.filteredPeople = this.people.filter(p =>
      (p.fullName || '').toLowerCase().includes(q) ||
      (p.company || '').toLowerCase().includes(q) ||
      (p.email || '').toLowerCase().includes(q)
    );
  }

  selectPerson(person: Person): void {
    this.personSelected.emit(person);
    this.close();
  }

  clearSelection(): void {
    this.personSelected.emit(null);
    this.close();
  }

  close(): void {
    this.modalClosed.emit();
  }
}
