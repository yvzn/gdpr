import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Person } from './models';

@Injectable({ providedIn: 'root' })
export class PeopleService {
  private http = inject(HttpClient);

  getAll(): Observable<Person[]> {
    return this.http.get<{ people: Person[] }>('/api/people').pipe(
      map(r => r.people)
    );
  }

  getById(id: number): Observable<Person> {
    return this.http.get<Person>(`/api/people/${id}`);
  }

  update(id: number, person: Person): Observable<void> {
    return this.http.put<void>(`/api/people/${id}`, person);
  }

  create(person: Omit<Person, 'id'>): Observable<void> {
    return this.http.post<void>('/api/people', person);
  }
}
