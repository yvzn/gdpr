import { Routes } from '@angular/router';
import { organizationFeatureRoutes } from 'organization-feature';

export const routes: Routes = [
  ...organizationFeatureRoutes,
  { path: '', redirectTo: 'organizations', pathMatch: 'full' },
];
