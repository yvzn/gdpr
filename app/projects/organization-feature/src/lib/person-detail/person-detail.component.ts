import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Person } from '../models';
import { PeopleService } from '../people.service';

@Component({
  selector: 'lib-person-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="p-4 max-w-2xl mx-auto">
      <div class="flex items-center mb-6">
        <a routerLink="/people" class="text-blue-600 hover:text-blue-700 dark:text-blue-400 mr-3">← Back</a>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ isNew ? 'Add Person' : 'Person Details' }}
        </h1>
      </div>

      @if (loading) {
        <div class="flex justify-center items-center h-32">
          <p class="text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      } @else {
        <form (ngSubmit)="onSave()" #form="ngForm">
          <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-6 dark:bg-gray-800 dark:border-gray-700">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Full Name</label>
                <input type="text" [(ngModel)]="person.fullName" name="fullName"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Company</label>
                <input type="text" [(ngModel)]="person.company" name="company"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                <input type="email" [(ngModel)]="person.email" name="email"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone</label>
                <input type="tel" [(ngModel)]="person.phone" name="phone"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div class="md:col-span-2">
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Address</label>
                <input type="text" [(ngModel)]="person.address" name="address"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">City</label>
                <input type="text" [(ngModel)]="person.city" name="city"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Zip Code</label>
                <input type="text" [(ngModel)]="person.zipCode" name="zipCode"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-4">
            @if (saveSuccess) {
              <span class="text-green-600 dark:text-green-400 text-sm self-center">Saved successfully!</span>
            }
            @if (saveError) {
              <span class="text-red-600 dark:text-red-400 text-sm self-center">{{ saveError }}</span>
            }
            <button type="submit" [disabled]="saving"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700">
              {{ saving ? 'Saving...' : (isNew ? 'Add Person' : 'Save Changes') }}
            </button>
          </div>
        </form>
      }
    </div>
  `
})
export class PersonDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private peopleService = inject(PeopleService);

  person: Person = { id: 0 };
  isNew = false;
  loading = false;
  saving = false;
  saveSuccess = false;
  saveError = '';

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam === 'new') {
      this.isNew = true;
    } else {
      const id = Number(idParam);
      if (id) {
        this.loading = true;
        this.peopleService.getById(id).subscribe({
          next: (person) => { this.person = { ...person }; this.loading = false; },
          error: () => { this.loading = false; }
        });
      }
    }
  }

  onSave(): void {
    this.saving = true;
    this.saveSuccess = false;
    this.saveError = '';
    if (this.isNew) {
      const { id, ...personData } = this.person;
      this.peopleService.create(personData).subscribe({
        next: () => {
          this.saving = false;
          this.router.navigate(['/people']);
        },
        error: () => {
          this.saving = false;
          this.saveError = 'Failed to create person. Please try again.';
        }
      });
    } else {
      this.peopleService.update(this.person.id, this.person).subscribe({
        next: () => {
          this.saving = false;
          this.saveSuccess = true;
          setTimeout(() => { this.saveSuccess = false; }, 3000);
        },
        error: () => {
          this.saving = false;
          this.saveError = 'Failed to save changes. Please try again.';
        }
      });
    }
  }
}
