export interface Person {
  id: number;
  fullName?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  email?: string;
  phone?: string;
  company?: string;
}

export interface Organization {
  id: number;
  name?: string;
  controllerId?: number;
  controller?: Person;
  jointControllerId?: number;
  jointController?: Person;
  controllersRepresentativeId?: number;
  controllersRepresentative?: Person;
  dataProtectionOfficerId?: number;
  dataProtectionOfficer?: Person;
}
