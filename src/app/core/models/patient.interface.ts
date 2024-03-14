export interface IPatientAccount {
  firstVerificationEmailSent?: boolean;
  verificationToken?: string;
  verified?: boolean;
  activationStep?: number;
  approvalStatus?: string;
  country?: string;
  accountStatus?: string;
}

export interface IPatient {
  id?: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  idNumber?: string;
  dob?: Date;
  idUrl?: string;
  avatarUrl?: string;
  phoneNumber?: string;
  account?: IPatientAccount;
}

export interface IPatientEmailExists {
  exists: boolean;
}
