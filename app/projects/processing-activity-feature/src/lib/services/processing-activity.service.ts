import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateProcessingActivityPayload, ProcessingActivity } from '../models/processing-activity.model';

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

	create(payload: CreateProcessingActivityPayload) {
		return this.http.post<CreateProcessingActivityResponse>(this.baseUrl, payload);
	}
}
