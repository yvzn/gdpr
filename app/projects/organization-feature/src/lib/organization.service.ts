import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Organization, OrganizationsResponse } from './models';

@Injectable({ providedIn: 'root' })
export class OrganizationService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/organizations';

  getAll() {
    return this.http.get<OrganizationsResponse>(this.baseUrl);
  }

  getById(id: number) {
    return this.http.get<Organization>(`${this.baseUrl}/${id}`);
  }

  update(organization: Organization) {
    return this.http.put<void>(`${this.baseUrl}/${organization.id}`, organization);
  }
}
