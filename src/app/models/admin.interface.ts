interface IAdminAccount {
  firstVerificationEmailSent?: boolean;
  verificationToken?: string;
  verified?: boolean;
  deleted?: boolean;
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
