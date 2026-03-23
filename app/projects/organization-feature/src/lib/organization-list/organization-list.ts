import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrganizationStore } from '../organization.store';

@Component({
  selector: 'lib-organization-list',
  imports: [FormsModule],
  templateUrl: './organization-list.html',
})
export class OrganizationList implements OnInit {
  readonly store = inject(OrganizationStore);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.store.loadAll();
  }

  navigateToDetail(id: number): void {
    this.router.navigate(['/organizations', id]);
  }
}
