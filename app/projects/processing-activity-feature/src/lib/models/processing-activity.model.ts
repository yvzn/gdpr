export interface ProcessingActivity {
	id: number;
	description: string | null;
	reference: string | null;
	created: string | null;
	updated: string | null;
}

export interface CreateProcessingActivityPayload {
	description: string | null;
	reference: string | null;
}
