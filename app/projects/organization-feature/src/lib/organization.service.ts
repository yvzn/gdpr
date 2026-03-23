import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Organization } from './models';

@Injectable({ providedIn: 'root' })
export class OrganizationService {
  private http = inject(HttpClient);

  getAll(): Observable<Organization[]> {
    return this.http.get<{ organizations: Organization[] }>('/api/organizations').pipe(
      map(r => r.organizations)
    );
  }

  getById(id: number): Observable<Organization> {
    return this.http.get<Organization>(`/api/organizations/${id}`);
  }

  update(id: number, org: Organization): Observable<void> {
    return this.http.put<void>(`/api/organizations/${id}`, org);
  }
}
