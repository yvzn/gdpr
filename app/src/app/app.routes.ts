import { Routes } from '@angular/router';
import { organizationFeatureRoutes } from '../../projects/organization-feature/src/public-api';
import { processingActivityFeatureRoutes } from '../../projects/processing-activity-feature/src/public-api';

export const routes: Routes = [
	...organizationFeatureRoutes,
	...processingActivityFeatureRoutes,
];
