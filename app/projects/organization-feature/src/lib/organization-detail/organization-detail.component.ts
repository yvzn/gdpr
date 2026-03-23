import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Organization, Person } from '../models';
import { OrganizationService } from '../organization.service';
import { PeoplePickerModalComponent } from '../people-picker-modal/people-picker-modal.component';

@Component({
  selector: 'lib-organization-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PeoplePickerModalComponent],
  template: `
    <div class="p-4 max-w-3xl mx-auto">
      <div class="flex items-center mb-6">
        <a routerLink="/organizations" class="text-blue-600 hover:text-blue-700 dark:text-blue-400 mr-3">← Back</a>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Organization Details</h1>
      </div>

      @if (loading) {
        <div class="flex justify-center items-center h-32">
          <p class="text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      } @else if (!organization) {
        <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-red-600">Organization not found.</p>
        </div>
      } @else {
        <form (ngSubmit)="onSave()" #form="ngForm">
          <!-- Basic Info Card -->
          <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-4 dark:bg-gray-800 dark:border-gray-700">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>
            <div class="mb-4">
              <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Organization Name</label>
              <input type="text" [(ngModel)]="organization.name" name="name"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
          </div>

          <!-- Key Roles Card -->
          <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-4 dark:bg-gray-800 dark:border-gray-700">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Key Roles</h2>

            <!-- Controller -->
            <div class="mb-4 p-3 border border-gray-100 rounded-lg dark:border-gray-600">
              <div class="flex justify-between items-center">
                <div>
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Controller</p>
                  <p class="text-sm text-gray-900 dark:text-white">{{ organization.controller?.fullName || '(Not assigned)' }}</p>
                  @if (organization.controller?.company) {
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ organization.controller?.company }}</p>
                  }
                </div>
                <button type="button" (click)="openPicker('controller')"
                  class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
                  {{ organization.controller ? 'Change' : 'Assign' }}
                </button>
              </div>
            </div>

            <!-- Joint Controller -->
            <div class="mb-4 p-3 border border-gray-100 rounded-lg dark:border-gray-600">
              <div class="flex justify-between items-center">
                <div>
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Joint Controller</p>
                  <p class="text-sm text-gray-900 dark:text-white">{{ organization.jointController?.fullName || '(Not assigned)' }}</p>
                  @if (organization.jointController?.company) {
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ organization.jointController?.company }}</p>
                  }
                </div>
                <button type="button" (click)="openPicker('jointController')"
                  class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
                  {{ organization.jointController ? 'Change' : 'Assign' }}
                </button>
              </div>
            </div>

            <!-- Controller's Representative -->
            <div class="mb-4 p-3 border border-gray-100 rounded-lg dark:border-gray-600">
              <div class="flex justify-between items-center">
                <div>
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Controller's Representative</p>
                  <p class="text-sm text-gray-900 dark:text-white">{{ organization.controllersRepresentative?.fullName || '(Not assigned)' }}</p>
                  @if (organization.controllersRepresentative?.company) {
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ organization.controllersRepresentative?.company }}</p>
                  }
                </div>
                <button type="button" (click)="openPicker('controllersRepresentative')"
                  class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
                  {{ organization.controllersRepresentative ? 'Change' : 'Assign' }}
                </button>
              </div>
            </div>

            <!-- DPO -->
            <div class="p-3 border border-gray-100 rounded-lg dark:border-gray-600">
              <div class="flex justify-between items-center">
                <div>
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Data Protection Officer</p>
                  <p class="text-sm text-gray-900 dark:text-white">{{ organization.dataProtectionOfficer?.fullName || '(Not assigned)' }}</p>
                  @if (organization.dataProtectionOfficer?.company) {
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ organization.dataProtectionOfficer?.company }}</p>
                  }
                </div>
                <button type="button" (click)="openPicker('dataProtectionOfficer')"
                  class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
                  {{ organization.dataProtectionOfficer ? 'Change' : 'Assign' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Save Button -->
          <div class="flex justify-end gap-3">
            @if (saveSuccess) {
              <span class="text-green-600 dark:text-green-400 text-sm self-center">Saved successfully!</span>
            }
            @if (saveError) {
              <span class="text-red-600 dark:text-red-400 text-sm self-center">{{ saveError }}</span>
            }
            <button type="submit" [disabled]="saving"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700">
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      }
    </div>

    <!-- People Picker Modal -->
    <lib-people-picker-modal
      [isOpen]="pickerOpen"
      [title]="pickerTitle"
      (personSelected)="onPersonSelected($event)"
      (modalClosed)="pickerOpen = false">
    </lib-people-picker-modal>
  `
})
export class OrganizationDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private orgService = inject(OrganizationService);

  organization: Organization | null = null;
  loading = false;
  saving = false;
  saveSuccess = false;
  saveError = '';

  pickerOpen = false;
  pickerTitle = '';
  activeRole: 'controller' | 'jointController' | 'controllersRepresentative' | 'dataProtectionOfficer' = 'controller';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loading = true;
      this.orgService.getById(id).subscribe({
        next: (org) => { this.organization = { ...org }; this.loading = false; },
        error: () => { this.loading = false; }
      });
    }
  }

  openPicker(role: typeof this.activeRole): void {
    this.activeRole = role;
    const titles: Record<typeof role, string> = {
      controller: 'Select Controller',
      jointController: 'Select Joint Controller',
      controllersRepresentative: "Select Controller's Representative",
      dataProtectionOfficer: 'Select Data Protection Officer'
    };
    this.pickerTitle = titles[role];
    this.pickerOpen = true;
  }

  onPersonSelected(person: Person | null): void {
    if (!this.organization) return;
    const roleMap: Record<typeof this.activeRole, { idKey: keyof Organization; objKey: keyof Organization }> = {
      controller: { idKey: 'controllerId', objKey: 'controller' },
      jointController: { idKey: 'jointControllerId', objKey: 'jointController' },
      controllersRepresentative: { idKey: 'controllersRepresentativeId', objKey: 'controllersRepresentative' },
      dataProtectionOfficer: { idKey: 'dataProtectionOfficerId', objKey: 'dataProtectionOfficer' }
    };
    const { idKey, objKey } = roleMap[this.activeRole];
    (this.organization as any)[idKey] = person?.id ?? null;
    (this.organization as any)[objKey] = person ?? undefined;
    this.pickerOpen = false;
  }

  onSave(): void {
    if (!this.organization) return;
    this.saving = true;
    this.saveSuccess = false;
    this.saveError = '';
    this.orgService.update(this.organization.id, this.organization).subscribe({
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
