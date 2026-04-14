import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import {
	MatCard,
	MatCardContent,
	MatCardHeader,
	MatCardTitle,
	MatCardActions,
} from '@angular/material/card';
import { MatError, MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatTab, MatTabGroup, MatTabLabel } from '@angular/material/tabs';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDivider } from '@angular/material/divider';
import { Store } from '@ngrx/store';

import { ProcessingActivityActions } from '../../store/processing-activity.actions';
import {
	selectSaving,
	selectError,
	selectLoadingDetail,
	selectSelectedActivity,
} from '../../store/processing-activity.selectors';
import { ErrorBannerComponent } from '../../components/error-banner/error-banner';
import { SkeletonCardComponent } from '../../components/skeleton-card/skeleton-card';
import type { UpdateProcessingActivityPayload } from '../../models/processing-activity.model';

@Component({
	selector: 'lib-activity-edit',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		RouterLink,
		ReactiveFormsModule,
		MatCard,
		MatCardContent,
		MatCardHeader,
		MatCardTitle,
		MatCardActions,
		MatFormField,
		MatLabel,
		MatHint,
		MatError,
		MatInput,
		MatButton,
		MatIconButton,
		MatIcon,
		MatProgressBar,
		MatTabGroup,
		MatTab,
		MatTabLabel,
		MatTooltip,
		MatDivider,
		ErrorBannerComponent,
		SkeletonCardComponent,
	],
	templateUrl: './activity-edit.html',
	styleUrl: './activity-edit.scss',
})
export class ActivityEditComponent {
	private readonly store = inject(Store);
	private readonly fb = inject(FormBuilder);
	private readonly route = inject(ActivatedRoute);

	readonly saving = this.store.selectSignal(selectSaving);
	readonly error = this.store.selectSignal(selectError);
	readonly loadingDetail = this.store.selectSignal(selectLoadingDetail);
	readonly activity = this.store.selectSignal(selectSelectedActivity);

	readonly activityForm = this.fb.group({
		description: ['', [Validators.required, Validators.maxLength(500)]],
		reference: ['', [Validators.maxLength(100)]],
		purposes: this.fb.array<FormGroup>([]),
		personalData: this.fb.array<FormGroup>([]),
		sensitiveData: this.fb.array<FormGroup>([]),
		dataSubjects: this.fb.array<FormGroup>([]),
		recipients: this.fb.array<FormGroup>([]),
		internationalRecipients: this.fb.array<FormGroup>([]),
		securityMeasures: this.fb.array<FormGroup>([]),
	});

	get purposes() {
		return this.activityForm.get('purposes') as FormArray;
	}
	get personalData() {
		return this.activityForm.get('personalData') as FormArray;
	}
	get sensitiveData() {
		return this.activityForm.get('sensitiveData') as FormArray;
	}
	get dataSubjects() {
		return this.activityForm.get('dataSubjects') as FormArray;
	}
	get recipients() {
		return this.activityForm.get('recipients') as FormArray;
	}
	get internationalRecipients() {
		return this.activityForm.get('internationalRecipients') as FormArray;
	}
	get securityMeasures() {
		return this.activityForm.get('securityMeasures') as FormArray;
	}

	private activityId = 0;

	constructor() {
		const id = Number(this.route.snapshot.paramMap.get('id'));
		if (id) {
			this.activityId = id;
			this.store.dispatch(ProcessingActivityActions.loadActivity({ id }));
		}

		effect(() => {
			const activity = this.activity();
			if (activity) {
				this.activityForm.patchValue({
					description: activity.description ?? '',
					reference: activity.reference ?? '',
				});

				this.purposes.clear();
				for (const p of activity.purposes) {
					this.purposes.push(this.createPurposeGroup(p.id, p.description));
				}

				this.personalData.clear();
				for (const p of activity.categoriesOfPersonalData) {
					this.personalData.push(
						this.createPersonalDataGroup(p.id, p.description, p.storagePeriod),
					);
				}

				this.sensitiveData.clear();
				for (const s of activity.categoriesOfSensitiveData) {
					this.sensitiveData.push(
						this.createPersonalDataGroup(s.id, s.description, s.storagePeriod),
					);
				}

				this.dataSubjects.clear();
				for (const d of activity.categoriesOfDataSubjects) {
					this.dataSubjects.push(this.createDataSubjectGroup(d.id, d.type, d.description));
				}

				this.recipients.clear();
				for (const r of activity.recipients) {
					this.recipients.push(this.createRecipientGroup(r.id, r.type, r.description));
				}

				this.internationalRecipients.clear();
				for (const ir of activity.internationalRecipients) {
					this.internationalRecipients.push(
						this.createInternationalRecipientGroup(
							ir.id,
							ir.description,
							ir.country,
							ir.guarantees.join(', '),
							ir.documentation,
						),
					);
				}

				this.securityMeasures.clear();
				for (const sm of activity.securityMeasures) {
					this.securityMeasures.push(
						this.createSecurityMeasureGroup(sm.id, sm.type, sm.description),
					);
				}
			}
		});
	}

	// Purpose helpers
	createPurposeGroup(id = 0, description: string | null = '') {
		return this.fb.group({
			id: [id],
			description: [description ?? '', Validators.required],
		});
	}

	addPurpose() {
		this.purposes.push(this.createPurposeGroup());
	}

	removePurpose(index: number) {
		this.purposes.removeAt(index);
	}

	// Personal data / sensitive data helpers
	createPersonalDataGroup(
		id = 0,
		description: string | null = '',
		storagePeriod: string | null = '',
	) {
		return this.fb.group({
			id: [id],
			description: [description ?? '', Validators.required],
			storagePeriod: [storagePeriod ?? ''],
		});
	}

	addPersonalData() {
		this.personalData.push(this.createPersonalDataGroup());
	}

	removePersonalData(index: number) {
		this.personalData.removeAt(index);
	}

	addSensitiveData() {
		this.sensitiveData.push(this.createPersonalDataGroup());
	}

	removeSensitiveData(index: number) {
		this.sensitiveData.removeAt(index);
	}

	// Data subject helpers
	createDataSubjectGroup(id = 0, type: string | null = '', description: string | null = '') {
		return this.fb.group({
			id: [id],
			type: [type ?? '', Validators.required],
			description: [description ?? ''],
		});
	}

	addDataSubject() {
		this.dataSubjects.push(this.createDataSubjectGroup());
	}

	removeDataSubject(index: number) {
		this.dataSubjects.removeAt(index);
	}

	// Recipient helpers
	createRecipientGroup(id = 0, type: string | null = '', description: string | null = '') {
		return this.fb.group({
			id: [id],
			type: [type ?? '', Validators.required],
			description: [description ?? ''],
		});
	}

	addRecipient() {
		this.recipients.push(this.createRecipientGroup());
	}

	removeRecipient(index: number) {
		this.recipients.removeAt(index);
	}

	// International recipient helpers
	createInternationalRecipientGroup(
		id = 0,
		description: string | null = '',
		country: string | null = '',
		guarantees = '',
		documentation: string | null = '',
	) {
		return this.fb.group({
			id: [id],
			description: [description ?? '', Validators.required],
			country: [country ?? ''],
			guarantees: [guarantees],
			documentation: [documentation ?? ''],
		});
	}

	addInternationalRecipient() {
		this.internationalRecipients.push(this.createInternationalRecipientGroup());
	}

	removeInternationalRecipient(index: number) {
		this.internationalRecipients.removeAt(index);
	}

	// Security measure helpers
	createSecurityMeasureGroup(id = 0, type: string | null = '', description: string | null = '') {
		return this.fb.group({
			id: [id],
			type: [type ?? '', Validators.required],
			description: [description ?? ''],
		});
	}

	addSecurityMeasure() {
		this.securityMeasures.push(this.createSecurityMeasureGroup());
	}

	removeSecurityMeasure(index: number) {
		this.securityMeasures.removeAt(index);
	}

	onSubmit() {
		if (this.activityForm.invalid) {
			this.activityForm.markAllAsTouched();
			return;
		}

		const raw = this.activityForm.getRawValue();

		const payload: UpdateProcessingActivityPayload = {
			id: this.activityId,
			description: raw.description || null,
			reference: raw.reference || null,
			purposes: raw.purposes.map((p) => ({
				id: p['id'] ?? 0,
				description: p['description'] || null,
			})),
			categoriesOfPersonalData: raw.personalData.map((p) => ({
				id: p['id'] ?? 0,
				description: p['description'] || null,
				storagePeriod: p['storagePeriod'] || null,
			})),
			categoriesOfDataSubjects: raw.dataSubjects.map((d) => ({
				id: d['id'] ?? 0,
				type: d['type'] || null,
				description: d['description'] || null,
			})),
			categoriesOfSensitiveData: raw.sensitiveData.map((s) => ({
				id: s['id'] ?? 0,
				description: s['description'] || null,
				storagePeriod: s['storagePeriod'] || null,
			})),
			recipients: raw.recipients.map((r) => ({
				id: r['id'] ?? 0,
				type: r['type'] || null,
				description: r['description'] || null,
			})),
			internationalRecipients: raw.internationalRecipients.map((ir) => ({
				id: ir['id'] ?? 0,
				description: ir['description'] || null,
				country: ir['country'] || null,
				guarantees: ir['guarantees']
					? ir['guarantees']
							.split(',')
							.map((g: string) => g.trim())
							.filter(Boolean)
					: [],
				documentation: ir['documentation'] || null,
			})),
			securityMeasures: raw.securityMeasures.map((sm) => ({
				id: sm['id'] ?? 0,
				type: sm['type'] || null,
				description: sm['description'] || null,
			})),
		};

		this.store.dispatch(ProcessingActivityActions.updateActivity({ payload }));
	}

	retry() {
		this.store.dispatch(ProcessingActivityActions.clearError());
		if (this.activityId) {
			this.store.dispatch(ProcessingActivityActions.loadActivity({ id: this.activityId }));
		}
	}
}
