import { computed, inject } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { Organization } from './models';
import { OrganizationService } from './organization.service';

interface OrganizationState {
  organizations: Organization[];
  selectedOrganization: Organization | null;
  loading: boolean;
  filter: string;
  currentPage: number;
  pageSize: number;
}

const initialState: OrganizationState = {
  organizations: [],
  selectedOrganization: null,
  loading: false,
  filter: '',
  currentPage: 1,
  pageSize: 6,
};

export const OrganizationStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    filteredOrganizations: computed(() => {
      const filter = store.filter().toLowerCase();
      if (!filter) return store.organizations();
      return store.organizations().filter(
        (org) => org.name?.toLowerCase().includes(filter)
      );
    }),
    totalPages: computed(() => {
      const filter = store.filter().toLowerCase();
      const filtered = !filter
        ? store.organizations()
        : store.organizations().filter((org) => org.name?.toLowerCase().includes(filter));
      return Math.max(1, Math.ceil(filtered.length / store.pageSize()));
    }),
    paginatedOrganizations: computed(() => {
      const filter = store.filter().toLowerCase();
      const filtered = !filter
        ? store.organizations()
        : store.organizations().filter((org) => org.name?.toLowerCase().includes(filter));
      const start = (store.currentPage() - 1) * store.pageSize();
      return filtered.slice(start, start + store.pageSize());
    }),
  })),
  withMethods((store, organizationService = inject(OrganizationService)) => ({
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
          organizationService.getAll().pipe(
            tap((response) =>
              patchState(store, {
                organizations: response.organizations,
                loading: false,
              })
            )
          )
        )
      )
    ),
    loadById: rxMethod<number>(
      pipe(
        tap(() => patchState(store, { loading: true })),
        switchMap((id) =>
          organizationService.getById(id).pipe(
            tap((organization) =>
              patchState(store, { selectedOrganization: organization, loading: false })
            )
          )
        )
      )
    ),
    updateOrganization: rxMethod<Organization>(
      pipe(
        tap(() => patchState(store, { loading: true })),
        switchMap((organization) =>
          organizationService.update(organization).pipe(
            tap(() =>
              patchState(store, {
                selectedOrganization: organization,
                loading: false,
                organizations: store.organizations().map((o) =>
                  o.id === organization.id ? organization : o
                ),
              })
            )
          )
        )
      )
    ),
    clearSelected(): void {
      patchState(store, { selectedOrganization: null });
    },
  }))
);
