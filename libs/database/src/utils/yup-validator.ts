import { idSchema, optionalDateSchema } from '@lib/schema';
import { Validator, ValidatorArgs } from 'objection';
import { BaseModel } from './base-model';

export class YupValidator extends Validator {
  validate(args: ValidatorArgs) {
    // The model instance. May be empty at this point.
    const model = args.model as BaseModel;

    // The properties to validate. After validation these values will
    // be merged into `model` by objection.
    const { json } = args;

    const baseSchema = model.schema.shape({
      id: idSchema.optional(),
      deletedAt: optionalDateSchema,
      createdAt: optionalDateSchema,
    });

    return (args.options.patch ? model.schema : baseSchema).validateSync(json, { strict: true });
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
