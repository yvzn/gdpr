import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PeopleStore } from '../people.store';

@Component({
  selector: 'lib-people-list',
  imports: [FormsModule],
  templateUrl: './people-list.html',
})
export class PeopleList implements OnInit {
  readonly store = inject(PeopleStore);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.store.loadAll();
  }

  navigateToDetail(id: number): void {
    this.router.navigate(['/people', id]);
  }

  navigateToNew(): void {
    this.router.navigate(['/people', 'new']);
  }
}
