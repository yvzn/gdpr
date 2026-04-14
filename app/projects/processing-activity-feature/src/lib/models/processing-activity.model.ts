export interface ProcessingActivity {
	id: number;
	description: string | null;
	reference: string | null;
	created: string | null;
	updated: string | null;
}

export interface ProcessingActivityDetail extends ProcessingActivity {
	purposes: Purpose[];
	categoriesOfPersonalData: PersonalDataItem[];
	categoriesOfDataSubjects: DataSubject[];
	categoriesOfSensitiveData: SensitiveDataItem[];
	recipients: Recipient[];
	internationalRecipients: InternationalRecipient[];
	securityMeasures: SecurityMeasure[];
}

export interface Purpose {
	id: number;
	description: string | null;
}

export interface PersonalDataItem {
	id: number;
	description: string | null;
	storagePeriod: string | null;
}

export interface SensitiveDataItem {
	id: number;
	description: string | null;
	storagePeriod: string | null;
}

export interface DataSubject {
	id: number;
	type: string | null;
	description: string | null;
}

export interface Recipient {
	id: number;
	type: string | null;
	description: string | null;
}

export interface InternationalRecipient {
	id: number;
	description: string | null;
	country: string | null;
	guarantees: string[];
	documentation: string | null;
}

export interface SecurityMeasure {
	id: number;
	type: string | null;
	description: string | null;
}

export interface CreateProcessingActivityPayload {
	description: string | null;
	reference: string | null;
}

export interface UpdateProcessingActivityPayload {
	id: number;
	description: string | null;
	reference: string | null;
	purposes: Purpose[];
	categoriesOfPersonalData: PersonalDataItem[];
	categoriesOfDataSubjects: DataSubject[];
	categoriesOfSensitiveData: SensitiveDataItem[];
	recipients: Recipient[];
	internationalRecipients: InternationalRecipient[];
	securityMeasures: SecurityMeasure[];
}
