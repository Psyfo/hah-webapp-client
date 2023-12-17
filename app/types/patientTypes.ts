export type IPatient = {
	id: string;
	date: Date;
	firstName: string;
	lastName: string;
	gender: string;
	dob: Date;
	pic: string;
	email: string;
	phoneNumber: string;
	password: string;
	associatedAccountId: string;
	associatedAccountRelationship: string;
	deleted: boolean;
};
