export interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean;
  status: boolean;
  lastLoginTime: number;
}
