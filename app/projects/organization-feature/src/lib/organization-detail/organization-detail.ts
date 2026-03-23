import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrganizationStore } from '../organization.store';
import { PeopleStore } from '../people.store';
import { Person } from '../models';
import { PeoplePickerModal } from '../people-picker-modal/people-picker-modal';

type PersonRole = 'controller' | 'jointController' | 'controllersRepresentative' | 'dataProtectionOfficer';

@Component({
  selector: 'lib-organization-detail',
  imports: [FormsModule, PeoplePickerModal],
  templateUrl: './organization-detail.html',
})
export class OrganizationDetail implements OnInit, OnDestroy {
  readonly store = inject(OrganizationStore);
  private readonly peopleStore = inject(PeopleStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  name = '';
  controllerId: number | null = null;
  jointControllerId: number | null = null;
  controllersRepresentativeId: number | null = null;
  dataProtectionOfficerId: number | null = null;

  showPeoplePicker = false;
  private activeRole: PersonRole | null = null;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.store.loadById(id);
      this.peopleStore.loadAll();
      this.watchOrganization();
    }
  }

  ngOnDestroy(): void {
    this.store.clearSelected();
  }

  private watchOrganization(): void {
    const checkLoaded = setInterval(() => {
      const org = this.store.selectedOrganization();
      if (org) {
        this.name = org.name ?? '';
        this.controllerId = org.controllerId;
        this.jointControllerId = org.jointControllerId;
        this.controllersRepresentativeId = org.controllersRepresentativeId;
        this.dataProtectionOfficerId = org.dataProtectionOfficerId;
        clearInterval(checkLoaded);
      }
    }, 100);

    setTimeout(() => clearInterval(checkLoaded), 10000);
  }

  getPersonName(personId: number | null): string {
    if (!personId) return '';
    const person = this.peopleStore.people().find((p: Person) => p.id === personId);
    return person?.fullName ?? `Person #${personId}`;
  }

  openPeoplePicker(role: PersonRole): void {
    this.activeRole = role;
    this.showPeoplePicker = true;
  }

  closePeoplePicker(): void {
    this.showPeoplePicker = false;
    this.activeRole = null;
  }

  onPersonSelected(person: Person): void {
    if (this.activeRole) {
      switch (this.activeRole) {
        case 'controller':
          this.controllerId = person.id;
          break;
        case 'jointController':
          this.jointControllerId = person.id;
          break;
        case 'controllersRepresentative':
          this.controllersRepresentativeId = person.id;
          break;
        case 'dataProtectionOfficer':
          this.dataProtectionOfficerId = person.id;
          break;
      }
    }
    this.closePeoplePicker();
  }

  clearPerson(role: PersonRole): void {
    switch (role) {
      case 'controller':
        this.controllerId = null;
        break;
      case 'jointController':
        this.jointControllerId = null;
        break;
      case 'controllersRepresentative':
        this.controllersRepresentativeId = null;
        break;
      case 'dataProtectionOfficer':
        this.dataProtectionOfficerId = null;
        break;
    }
  }

  save(): void {
    const org = this.store.selectedOrganization();
    if (!org) return;

    this.store.updateOrganization({
      id: org.id,
      name: this.name || null,
      controllerId: this.controllerId,
      jointControllerId: this.jointControllerId,
      controllersRepresentativeId: this.controllersRepresentativeId,
      dataProtectionOfficerId: this.dataProtectionOfficerId,
    });
  }

  goBack(): void {
    this.router.navigate(['/organizations']);
  }
}
