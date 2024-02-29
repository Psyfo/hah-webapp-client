export interface IPatientAccount {
  firstVerificationEmailSent?: boolean;
  verificationToken?: string;
  verified: boolean;
  activationStep: number;
  approvalStatus: string;
  country: string;
  deleted: boolean;
}

export interface IPatient {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  idNumber: string;
  dob: Date;
  imgUrl: string;
  phoneNumber: string;
  account: IPatientAccount;
}

export interface IPatientEmailExists {
  exists: boolean;
}
