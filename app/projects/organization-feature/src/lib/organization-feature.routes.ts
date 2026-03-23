import { Routes } from '@angular/router';
import { OrganizationList } from './organization-list/organization-list';
import { OrganizationDetail } from './organization-detail/organization-detail';
import { PeopleList } from './people-list/people-list';
import { PersonDetail } from './person-detail/person-detail';

export const organizationFeatureRoutes: Routes = [
  { path: 'organizations', component: OrganizationList },
  { path: 'organizations/:id', component: OrganizationDetail },
  { path: 'people', component: PeopleList },
  { path: 'people/:id', component: PersonDetail },
];
