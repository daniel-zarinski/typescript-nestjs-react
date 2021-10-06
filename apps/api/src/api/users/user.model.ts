import { userModelSchema } from '@lib/schema';
import { Role } from '@lib/shared';
import BaseModel from '@lib/shared/models/base-model';

export default class User extends BaseModel<typeof userModelSchema> {
  email!: string;
  password!: string;
  firstName!: string;
  lastName?: string;
  isActive?: boolean;
  roles: Role[];

  constructor() {
    super();
    this.schema = userModelSchema;
  }

  static tableName = 'user';

  static get virtualAttributes() {
    return ['fullName'];
  }

  // This object defines the relations to other models. The relationMappings
  // property can be a thunk to prevent circular dependencies.
  static relationMappings = () => ({
    // owner: {
    //   relation: Model.BelongsToOneRelation,
    //   // The related model.
    //   modelClass: Person,
    //   join: {
    //     from: 'animals.ownerId',
    //     to: 'persons.id',
    //   },
    // },
  });

  get fullName() {
    return [this.firstName, this.lastName].join(' ');
  }
}
