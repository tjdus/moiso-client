export interface SignupDTO {
  username: string;
  password: string;
  confirmedPassword: string;
  name: string;
  email: string;
}

export interface LoginDTO {
  username: string;
  password: string;
}
