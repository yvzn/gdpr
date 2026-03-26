import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreatePersonPayload, Person, UpdatePersonPayload } from '../models/person.model';

interface ReadAllPeopleResponse {
	people: Person[];
}

@Injectable({ providedIn: 'root' })
export class PersonService {
	private readonly http = inject(HttpClient);
	private readonly baseUrl = '/api/people';

	getAll() {
		return this.http.get<ReadAllPeopleResponse>(this.baseUrl);
	}

	getById(id: number) {
		return this.http.get<Person>(`${this.baseUrl}/${id}`);
	}

	update(payload: UpdatePersonPayload) {
		return this.http.put<void>(`${this.baseUrl}/${payload.id}`, payload);
	}

	create(payload: CreatePersonPayload) {
		return this.http.post<void>(this.baseUrl, payload);
	}
}
