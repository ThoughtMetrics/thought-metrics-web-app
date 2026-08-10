export interface ClientSignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  companyName: string;
  termsAccepted: boolean;
  privacyAccepted: boolean;
}
