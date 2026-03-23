import { computed, inject } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, pipe, switchMap, tap } from 'rxjs';
import { Person } from './models';
import { PeopleService } from './people.service';

interface PeopleState {
  people: Person[];
  selectedPerson: Person | null;
  loading: boolean;
  filter: string;
  currentPage: number;
  pageSize: number;
}

const initialState: PeopleState = {
  people: [],
  selectedPerson: null,
  loading: false,
  filter: '',
  currentPage: 1,
  pageSize: 6,
};

export const PeopleStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => {
    const filteredPeople = computed(() => {
      const filter = store.filter().toLowerCase();
      if (!filter) return store.people();
      return store.people().filter(
        (p) =>
          p.fullName?.toLowerCase().includes(filter) ||
          p.email?.toLowerCase().includes(filter) ||
          p.company?.toLowerCase().includes(filter)
      );
    });
    return {
      filteredPeople,
      totalPages: computed(() =>
        Math.max(1, Math.ceil(filteredPeople().length / store.pageSize()))
      ),
      paginatedPeople: computed(() => {
        const start = (store.currentPage() - 1) * store.pageSize();
        return filteredPeople().slice(start, start + store.pageSize());
      }),
    };
  }),
  withMethods((store, peopleService = inject(PeopleService)) => ({
    setFilter(filter: string): void {
      patchState(store, { filter, currentPage: 1 });
    },
    setPage(page: number): void {
      patchState(store, { currentPage: page });
    },
    loadAll: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true })),
        switchMap(() =>
          peopleService.getAll().pipe(
            tap((response) =>
              patchState(store, {
                people: response.people,
                loading: false,
              })
            ),
            catchError(() => {
              patchState(store, { loading: false });
              return EMPTY;
            })
          )
        )
      )
    ),
    loadById: rxMethod<number>(
      pipe(
        tap(() => patchState(store, { loading: true })),
        switchMap((id) =>
          peopleService.getById(id).pipe(
            tap((person) =>
              patchState(store, { selectedPerson: person, loading: false })
            ),
            catchError(() => {
              patchState(store, { loading: false });
              return EMPTY;
            })
          )
        )
      )
    ),
    updatePerson: rxMethod<Person>(
      pipe(
        tap(() => patchState(store, { loading: true })),
        switchMap((person) =>
          peopleService.update(person).pipe(
            tap(() =>
              patchState(store, {
                selectedPerson: person,
                loading: false,
                people: store.people().map((p) =>
                  p.id === person.id ? person : p
                ),
              })
            ),
            catchError(() => {
              patchState(store, { loading: false });
              return EMPTY;
            })
          )
        )
      )
    ),
    createPerson: rxMethod<Omit<Person, 'id'>>(
      pipe(
        tap(() => patchState(store, { loading: true })),
        switchMap((person) =>
          peopleService.create(person).pipe(
            tap((response) => {
              const newPerson: Person = { ...person, id: response.id } as Person;
              patchState(store, {
                selectedPerson: newPerson,
                loading: false,
                people: [...store.people(), newPerson],
              });
            }),
            catchError(() => {
              patchState(store, { loading: false });
              return EMPTY;
            })
          )
        )
      )
    ),
    clearSelected(): void {
      patchState(store, { selectedPerson: null });
    },
  }))
);
