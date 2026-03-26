export interface Organization {
	id: number;
	name: string | null;
	controllerId: number | null;
	jointControllerId: number | null;
	controllersRepresentativeId: number | null;
	dataProtectionOfficerId: number | null;
}

export interface OrganizationDetail extends Organization {}

export interface UpdateOrganizationPayload {
	id: number;
	name: string | null;
	controllerId: number | null;
	jointControllerId: number | null;
	controllersRepresentativeId: number | null;
	dataProtectionOfficerId: number | null;
}
