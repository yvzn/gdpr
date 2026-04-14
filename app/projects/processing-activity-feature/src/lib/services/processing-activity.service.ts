import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
	CreateProcessingActivityPayload,
	ProcessingActivity,
	ProcessingActivityDetail,
	UpdateProcessingActivityPayload,
} from '../models/processing-activity.model';

interface ReadAllProcessingActivitiesResponse {
	processingActivities: ProcessingActivity[];
}

interface CreateProcessingActivityResponse {
	id: number;
}

@Injectable({ providedIn: 'root' })
export class ProcessingActivityService {
	private readonly http = inject(HttpClient);
	private readonly baseUrl = '/api/ProcessingActivities';

	getAll() {
		return this.http.get<ReadAllProcessingActivitiesResponse>(this.baseUrl);
	}

	getById(id: number) {
		return this.http.get<ProcessingActivityDetail>(`${this.baseUrl}/${id}`);
	}

	create(payload: CreateProcessingActivityPayload) {
		return this.http.post<CreateProcessingActivityResponse>(this.baseUrl, payload);
	}

	update(payload: UpdateProcessingActivityPayload) {
		return this.http.put<void>(`${this.baseUrl}/${payload.id}`, payload);
	}
}
