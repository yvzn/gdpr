import { Routes } from '@angular/router';

export const organizationFeatureRoutes: Routes = [
	{
		path: 'organizations',
		loadComponent: () =>
			import('./views/organization-list/organization-list').then(
				(m) => m.OrganizationListComponent,
			),
	},
	{
		path: 'organizations/:id',
		loadComponent: () =>
			import('./views/organization-detail/organization-detail').then(
				(m) => m.OrganizationDetailComponent,
			),
	},
	{
		path: 'people',
		loadComponent: () =>
			import('./views/person-list/person-list').then((m) => m.PersonListComponent),
	},
	{
		path: 'people/:id',
		loadComponent: () =>
			import('./views/person-detail/person-detail').then((m) => m.PersonDetailComponent),
	},
];
