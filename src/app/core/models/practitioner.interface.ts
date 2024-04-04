export interface IPractitionerAccount {
  firstVerificationEmailSent?: boolean;
  verificationToken?: string;
  verified?: boolean;
  passwordResetToken?: string;
  activationStep?: number;
  approvalStatus?: string;
  country?: string;
  accountStatus?: string;
}

export interface IPractitioner {
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
  account?: IPractitionerAccount;
}

export interface IPractitionerEmailExists {
  exists: boolean;
}
