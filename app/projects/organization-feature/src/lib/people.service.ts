import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Person, PeopleResponse } from './models';

@Injectable({ providedIn: 'root' })
export class PeopleService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/people';

  getAll() {
    return this.http.get<PeopleResponse>(this.baseUrl);
  }

  getById(id: number) {
    return this.http.get<Person>(`${this.baseUrl}/${id}`);
  }

  update(person: Person) {
    return this.http.put<void>(`${this.baseUrl}/${person.id}`, person);
  }

  create(person: Omit<Person, 'id'>) {
    return this.http.post<{ id: number }>(this.baseUrl, person);
  }
}
