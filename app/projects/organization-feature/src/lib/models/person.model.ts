export interface Person {
	id: number;
	fullName: string | null;
	address: string | null;
	city: string | null;
	zipCode: string | null;
	email: string | null;
	phone: string | null;
	company: string | null;
}

export interface CreatePersonPayload {
	fullName: string | null;
	address: string | null;
	city: string | null;
	zipCode: string | null;
	email: string | null;
	phone: string | null;
	company: string | null;
}

export interface UpdatePersonPayload {
	id: number;
	fullName: string | null;
	address: string | null;
	city: string | null;
	zipCode: string | null;
	email: string | null;
	phone: string | null;
	company: string | null;
}
