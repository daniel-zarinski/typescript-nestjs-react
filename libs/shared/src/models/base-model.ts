import { Model } from 'objection';
import { AnyObjectSchema } from 'yup';
import YupValidator from './validator-model';

export default class BaseModel<Schema extends AnyObjectSchema> extends Model {
  id!: number;

  schema!: Schema;

  static createValidator() {
    return new YupValidator();
  }
}
