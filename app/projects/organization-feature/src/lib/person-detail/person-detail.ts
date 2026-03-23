import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PeopleStore } from '../people.store';

@Component({
  selector: 'lib-person-detail',
  imports: [FormsModule],
  templateUrl: './person-detail.html',
})
export class PersonDetail implements OnInit, OnDestroy {
  readonly store = inject(PeopleStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  isNew = false;
  fullName = '';
  company = '';
  email = '';
  phone = '';
  address = '';
  city = '';
  zipCode = '';

  private personId = 0;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam === 'new') {
      this.isNew = true;
    } else {
      const id = Number(idParam);
      if (id) {
        this.personId = id;
        this.store.loadById(id);
        this.watchPerson();
      }
    }
  }

  ngOnDestroy(): void {
    this.store.clearSelected();
  }

  private watchPerson(): void {
    const checkLoaded = setInterval(() => {
      const person = this.store.selectedPerson();
      if (person) {
        this.fullName = person.fullName ?? '';
        this.company = person.company ?? '';
        this.email = person.email ?? '';
        this.phone = person.phone ?? '';
        this.address = person.address ?? '';
        this.city = person.city ?? '';
        this.zipCode = person.zipCode ?? '';
        clearInterval(checkLoaded);
      }
    }, 100);

    setTimeout(() => clearInterval(checkLoaded), 10000);
  }

  save(): void {
    if (this.isNew) {
      this.store.createPerson({
        fullName: this.fullName || null,
        company: this.company || null,
        email: this.email || null,
        phone: this.phone || null,
        address: this.address || null,
        city: this.city || null,
        zipCode: this.zipCode || null,
      });
      this.router.navigate(['/people']);
    } else {
      this.store.updatePerson({
        id: this.personId,
        fullName: this.fullName || null,
        company: this.company || null,
        email: this.email || null,
        phone: this.phone || null,
        address: this.address || null,
        city: this.city || null,
        zipCode: this.zipCode || null,
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/people']);
  }
}
