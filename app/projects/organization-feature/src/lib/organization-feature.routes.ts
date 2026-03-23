import { Routes } from '@angular/router';

export const organizationFeatureRoutes: Routes = [
  {
    path: 'organizations',
    loadComponent: () => import('./organization-list/organization-list.component').then(m => m.OrganizationListComponent)
  },
  {
    path: 'organizations/:id',
    loadComponent: () => import('./organization-detail/organization-detail.component').then(m => m.OrganizationDetailComponent)
  },
  {
    path: 'people',
    loadComponent: () => import('./people-list/people-list.component').then(m => m.PeopleListComponent)
  },
  {
    path: 'people/:id',
    loadComponent: () => import('./person-detail/person-detail.component').then(m => m.PersonDetailComponent)
  }
];
