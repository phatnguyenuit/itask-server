export type LoginInput = {
  email: string;
  password: string;
};

export type ChangePasswordInput = {
  email: string;
  currentPassword: string;
  newPassword: string;
  rePassword: string;
};

export type SignupInput = {
  name: string;
  email: string;
  password: string;
  rePassword: string;
};
