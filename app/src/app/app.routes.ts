import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: 'organizations',
		loadComponent: () =>
			import('../../projects/organization-feature/src/lib/views/organization-list/organization-list').then(
				(m) => m.OrganizationListComponent,
			),
	},
	{
		path: 'organizations/:id',
		loadComponent: () =>
			import('../../projects/organization-feature/src/lib/views/organization-detail/organization-detail').then(
				(m) => m.OrganizationDetailComponent,
			),
	},
	{
		path: 'people',
		loadComponent: () =>
			import('../../projects/organization-feature/src/lib/views/person-list/person-list').then(
				(m) => m.PersonListComponent,
			),
	},
	{
		path: 'people/:id',
		loadComponent: () =>
			import('../../projects/organization-feature/src/lib/views/person-detail/person-detail').then(
				(m) => m.PersonDetailComponent,
			),
	},
];
