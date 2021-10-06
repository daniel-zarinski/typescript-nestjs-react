import { Validator, ValidatorArgs } from 'objection';
import BaseModel from './base-model';
import * as yup from 'yup';
import { idSchema } from '../yup-schemas';

export default class YupValidator extends Validator {
  validate(args: ValidatorArgs) {
    // The model instance. May be empty at this point.
    const model = args.model as BaseModel<yup.ObjectSchema<any>>;

    // The properties to validate. After validation these values will
    // be merged into `model` by objection.
    const json = args.json;

    const schemaWithId = model.schema.shape({
      id: idSchema,
    });

    return (args.options.patch ? model.schema : schemaWithId).validateSync(json);
  }

  beforeValidate(args: ValidatorArgs) {
    // Takes the same arguments as `validate`. Usually there is no need
    // to override this.
    return super.beforeValidate(args);
  }

  afterValidate(args: ValidatorArgs) {
    // Takes the same arguments as `validate`. Usually there is no need
    // to override this.
    return super.afterValidate(args);
  }
}
