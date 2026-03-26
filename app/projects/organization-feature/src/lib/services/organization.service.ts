import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
	Organization,
	OrganizationDetail,
	UpdateOrganizationPayload,
} from '../models/organization.model';

interface ReadAllOrganizationsResponse {
	organizations: Organization[];
}

@Injectable({ providedIn: 'root' })
export class OrganizationService {
	private readonly http = inject(HttpClient);
	private readonly baseUrl = '/api/organizations';

	getAll() {
		return this.http.get<ReadAllOrganizationsResponse>(this.baseUrl);
	}

	getById(id: number) {
		return this.http.get<OrganizationDetail>(`${this.baseUrl}/${id}`);
	}

	update(payload: UpdateOrganizationPayload) {
		return this.http.put<void>(`${this.baseUrl}/${payload.id}`, payload);
	}
}
