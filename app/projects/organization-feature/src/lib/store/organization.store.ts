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
import {
	Organization,
	OrganizationDetail,
	UpdateOrganizationPayload,
} from '../models/organization.model';
import { OrganizationService } from '../services/organization.service';

interface OrganizationState {
	organizations: Organization[];
	selectedOrganization: OrganizationDetail | null;
	loading: boolean;
	loadingDetail: boolean;
	saving: boolean;
	error: string | null;
	filter: string;
	page: number;
	pageSize: number;
}

const initialState: OrganizationState = {
	organizations: [],
	selectedOrganization: null,
	loading: false,
	loadingDetail: false,
	saving: false,
	error: null,
	filter: '',
	page: 0,
	pageSize: 12,
};

export const OrganizationStore = signalStore(
	{ providedIn: 'root' },
	withState(initialState),
	withComputed((store) => ({
		filteredOrganizations: computed(() => {
			const filter = store.filter().toLowerCase();
			if (!filter) {
				return store.organizations();
			}
			return store.organizations().filter((org) => org.name?.toLowerCase().includes(filter));
		}),
		paginatedOrganizations: computed(() => {
			const filter = store.filter().toLowerCase();
			let items = store.organizations();
			if (filter) {
				items = items.filter((org) => org.name?.toLowerCase().includes(filter));
			}
			const start = store.page() * store.pageSize();
			return items.slice(start, start + store.pageSize());
		}),
		totalFilteredCount: computed(() => {
			const filter = store.filter().toLowerCase();
			if (!filter) {
				return store.organizations().length;
			}
			return store.organizations().filter((org) => org.name?.toLowerCase().includes(filter)).length;
		}),
	})),
	withMethods((store, service = inject(OrganizationService)) => ({
		setFilter(filter: string) {
			patchState(store, { filter, page: 0 });
		},
		setPage(page: number) {
			patchState(store, { page });
		},
		clearSelectedOrganization() {
			patchState(store, { selectedOrganization: null });
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
									organizations: response.organizations,
									loading: false,
								}),
							error: () =>
								patchState(store, {
									loading: false,
									error: $localize`:@@org.error.loadAll:Failed to load organizations.`,
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
							next: (org) =>
								patchState(store, {
									selectedOrganization: org,
									loadingDetail: false,
								}),
							error: () =>
								patchState(store, {
									loadingDetail: false,
									error: $localize`:@@org.error.loadDetail:Failed to load organization details.`,
								}),
						}),
					),
				),
			),
		),
		update: rxMethod<UpdateOrganizationPayload>(
			pipe(
				tap(() => patchState(store, { saving: true, error: null })),
				switchMap((payload) =>
					service.update(payload).pipe(
						tapResponse({
							next: () => {
								patchState(store, { saving: false });
								// Refresh the list
								service
									.getAll()
									.subscribe((response) =>
										patchState(store, { organizations: response.organizations }),
									);
								// Refresh the detail
								service
									.getById(payload.id)
									.subscribe((org) => patchState(store, { selectedOrganization: org }));
							},
							error: () =>
								patchState(store, {
									saving: false,
									error: $localize`:@@org.error.update:Failed to update organization.`,
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
