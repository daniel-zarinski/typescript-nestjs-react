import { BaseModel, ModelSchema, ObjectModelOf } from '@lib/database';
import { userModelSchema } from '@lib/schema';
import { Role } from '@lib/shared';
import * as _ from 'lodash';
import { Pojo } from 'objection';

export type IUser = ObjectModelOf<User>;

export class User extends BaseModel implements ModelSchema {
  constructor() {
    super(userModelSchema);
  }

  static tableName = 'user';

  email!: string;
  password!: string;
  firstName!: string;
  lastName?: string;
  roles: Role[];

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  static get virtualAttributes() {
    return ['fullName'];
  }

  $formatJson(_json: Pojo) {
    const json = super.$formatJson(_json);

    return _.omit(json, 'password');
  }
}
