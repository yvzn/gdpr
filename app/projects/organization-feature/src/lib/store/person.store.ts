import { computed, inject } from '@angular/core';
import {
	signalStore,
	withState,
	withComputed,
	withMethods,
	patchState,
	withHooks,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { pipe, switchMap, tap } from 'rxjs';
import { CreatePersonPayload, Person, UpdatePersonPayload } from '../models/person.model';
import { PersonService } from '../services/person.service';

interface PersonState {
	people: Person[];
	selectedPerson: Person | null;
	loading: boolean;
	loadingDetail: boolean;
	saving: boolean;
	error: string | null;
	filter: string;
	page: number;
	pageSize: number;
}

const initialState: PersonState = {
	people: [],
	selectedPerson: null,
	loading: false,
	loadingDetail: false,
	saving: false,
	error: null,
	filter: '',
	page: 0,
	pageSize: 12,
};

export const PersonStore = signalStore(
	{ providedIn: 'root' },
	withState(initialState),
	withComputed((store) => ({
		filteredPeople: computed(() => {
			const filter = store.filter().toLowerCase();
			if (!filter) {
				return store.people();
			}
			return store
				.people()
				.filter(
					(p) =>
						p.fullName?.toLowerCase().includes(filter) ||
						p.email?.toLowerCase().includes(filter) ||
						p.company?.toLowerCase().includes(filter),
				);
		}),
		paginatedPeople: computed(() => {
			const filter = store.filter().toLowerCase();
			let items = store.people();
			if (filter) {
				items = items.filter(
					(p) =>
						p.fullName?.toLowerCase().includes(filter) ||
						p.email?.toLowerCase().includes(filter) ||
						p.company?.toLowerCase().includes(filter),
				);
			}
			const start = store.page() * store.pageSize();
			return items.slice(start, start + store.pageSize());
		}),
		totalFilteredCount: computed(() => {
			const filter = store.filter().toLowerCase();
			if (!filter) {
				return store.people().length;
			}
			return store
				.people()
				.filter(
					(p) =>
						p.fullName?.toLowerCase().includes(filter) ||
						p.email?.toLowerCase().includes(filter) ||
						p.company?.toLowerCase().includes(filter),
				).length;
		}),
	})),
	withMethods((store, service = inject(PersonService)) => ({
		setFilter(filter: string) {
			patchState(store, { filter, page: 0 });
		},
		setPage(page: number) {
			patchState(store, { page });
		},
		clearSelectedPerson() {
			patchState(store, { selectedPerson: null });
		},
		clearError() {
			patchState(store, { error: null });
		},
		loadAll: rxMethod<void>(
			pipe(
				tap(() => patchState(store, { loading: true, error: null })),
				switchMap(() =>
					service.getAll().pipe(
						tapResponse({
							next: (response) =>
								patchState(store, {
									people: response.people,
									loading: false,
								}),
							error: () =>
								patchState(store, {
									loading: false,
									error: 'Failed to load people.',
								}),
						}),
					),
				),
			),
		),
		loadById: rxMethod<number>(
			pipe(
				tap(() => patchState(store, { loadingDetail: true, error: null })),
				switchMap((id) =>
					service.getById(id).pipe(
						tapResponse({
							next: (person) =>
								patchState(store, {
									selectedPerson: person,
									loadingDetail: false,
								}),
							error: () =>
								patchState(store, {
									loadingDetail: false,
									error: 'Failed to load person details.',
								}),
						}),
					),
				),
			),
		),
		update: rxMethod<UpdatePersonPayload>(
			pipe(
				tap(() => patchState(store, { saving: true, error: null })),
				switchMap((payload) =>
					service.update(payload).pipe(
						tapResponse({
							next: () => {
								patchState(store, { saving: false });
								service
									.getAll()
									.subscribe((response) => patchState(store, { people: response.people }));
								service
									.getById(payload.id)
									.subscribe((person) => patchState(store, { selectedPerson: person }));
							},
							error: () =>
								patchState(store, {
									saving: false,
									error: 'Failed to update person.',
								}),
						}),
					),
				),
			),
		),
		create: rxMethod<CreatePersonPayload>(
			pipe(
				tap(() => patchState(store, { saving: true, error: null })),
				switchMap((payload) =>
					service.create(payload).pipe(
						tapResponse({
							next: () => {
								patchState(store, { saving: false });
								service
									.getAll()
									.subscribe((response) => patchState(store, { people: response.people }));
							},
							error: () =>
								patchState(store, {
									saving: false,
									error: 'Failed to create person.',
								}),
						}),
					),
				),
			),
		),
	})),
	withHooks({
		onInit(store) {
			store.loadAll();
		},
	}),
);
