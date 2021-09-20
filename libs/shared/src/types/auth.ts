export enum Role {
  User = 'user',
  Admin = 'admin',
}

export type JWT = {
  id: number;
  iat: number;
  exp: number;
  role: Role[];
};
