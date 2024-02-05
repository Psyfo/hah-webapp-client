export interface IPatient {
  firstName: string;
  lastName: string;
  gender: string;
  dob: Date;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface IPatientEmailExists {
  exists: boolean;
}
