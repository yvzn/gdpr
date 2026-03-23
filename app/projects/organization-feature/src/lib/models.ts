export interface Organization {
  id: number;
  name: string | null;
  controllerId: number | null;
  jointControllerId: number | null;
  controllersRepresentativeId: number | null;
  dataProtectionOfficerId: number | null;
}

export interface Person {
  id: number;
  fullName: string | null;
  address: string | null;
  city: string | null;
  zipCode: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
}

export interface OrganizationsResponse {
  organizations: Organization[];
}

export interface PeopleResponse {
  people: Person[];
}
