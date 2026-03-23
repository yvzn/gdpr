import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Person } from '../models';
import { PeopleService } from '../people.service';

@Component({
  selector: 'lib-people-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="p-4">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">People</h1>
        <a routerLink="/people/new"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700">
          + Add Person
        </a>
      </div>

      <!-- Search -->
      <div class="mb-4">
        <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="onSearch()"
          placeholder="Search people..."
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full md:w-80 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" />
      </div>

      @if (loading) {
        <div class="flex justify-center items-center h-32">
          <p class="text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      } @else if (loadError) {
        <div class="p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900 dark:border-red-700">
          <p class="text-red-600 dark:text-red-400">{{ loadError }}</p>
        </div>
      } @else if (filteredPeople.length === 0) {
        <div class="flex justify-center items-center h-32">
          <p class="text-gray-500 dark:text-gray-400">No people found.</p>
        </div>
      } @else {
        <!-- Card Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          @for (person of pagedPeople; track person.id) {
            <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-5 dark:bg-gray-800 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div class="flex justify-between items-start mb-2">
                <h5 class="text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {{ person.fullName || '(No name)' }}
                </h5>
                <span class="text-xs font-medium text-gray-500 dark:text-gray-400">#{{ person.id }}</span>
              </div>
              @if (person.company) {
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span class="font-medium">Company:</span> {{ person.company }}
                </p>
              }
              @if (person.email) {
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span class="font-medium">Email:</span> {{ person.email }}
                </p>
              }
              @if (person.phone) {
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span class="font-medium">Phone:</span> {{ person.phone }}
                </p>
              }
              <div class="mt-4">
                <a [routerLink]="['/people', person.id]"
                  class="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm font-medium">
                  View details →
                </a>
              </div>
            </div>
          }
        </div>

        <!-- Pagination -->
        @if (totalPages > 1) {
          <nav class="flex justify-center items-center space-x-2">
            <button (click)="prevPage()" [disabled]="currentPage === 1"
              class="px-3 py-1 text-sm rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white">
              Previous
            </button>
            @for (page of pages; track page) {
              <button (click)="goToPage(page)"
                [class]="page === currentPage
                  ? 'px-3 py-1 text-sm rounded-lg bg-blue-600 text-white'
                  : 'px-3 py-1 text-sm rounded-lg border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white'">
                {{ page }}
              </button>
            }
            <button (click)="nextPage()" [disabled]="currentPage === totalPages"
              class="px-3 py-1 text-sm rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white">
              Next
            </button>
          </nav>
        }
      }
    </div>
  `
})
export class PeopleListComponent implements OnInit {
  private peopleService = inject(PeopleService);

  people: Person[] = [];
  filteredPeople: Person[] = [];
  pagedPeople: Person[] = [];
  searchQuery = '';
  loading = false;
  loadError = '';

  currentPage = 1;
  pageSize = 9;
  totalPages = 1;
  pages: number[] = [];

  ngOnInit(): void {
    this.loading = true;
    this.peopleService.getAll().subscribe({
      next: (people) => {
        this.people = people;
        this.filteredPeople = people;
        this.updatePagination();
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
      (p.email || '').toLowerCase().includes(q) ||
      (p.city || '').toLowerCase().includes(q)
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.max(1, Math.ceil(this.filteredPeople.length / this.pageSize));
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updatePage();
  }

  updatePage(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    this.pagedPeople = this.filteredPeople.slice(start, start + this.pageSize);
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePage();
  }

  prevPage(): void {
    if (this.currentPage > 1) { this.currentPage--; this.updatePage(); }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) { this.currentPage++; this.updatePage(); }
  }
}
