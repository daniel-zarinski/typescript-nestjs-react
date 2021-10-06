import { Role } from '../enums';

export type JWT = {
  id: number;
  iat: number;
  exp: number;
  roles: Role[];
};
