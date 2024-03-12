interface IAdminAccount {
  firstVerificationEmailSent?: boolean;
  verificationToken?: string;
  verified?: boolean;
  deleted?: boolean;
  accountStatus?: string;
  role?: string;
}

interface IAdmin {
  id?: string;
  email?: string;
  password?: string;
  dob?: Date;
  imgUrl?: string;
  account?: IAdminAccount;
}

export { IAdmin, IAdminAccount };
