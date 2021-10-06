import { Nullable } from '@lib/shared';
import * as _ from 'lodash';
import { Model, ModelObject, ModelOptions, Pojo } from 'objection';
import { AnyObjectSchema } from 'yup';
import { BaseQueryBuilder } from './query-builder';
import { YupValidator } from './yup-validator';

export type OmitSchema<T> = Omit<T, 'schema'>;
export type IBaseModel = OmitSchema<ModelObject<BaseModel>>;
export type ObjectModelOf<M extends BaseModel> = OmitSchema<ModelObject<M>> & IBaseModel;

export interface ModelSchema {
  readonly schema: AnyObjectSchema;
}

export class BaseModel extends Model implements ModelSchema {
  id!: number;
  createdAt!: Date;
  deletedAt!: Nullable<Date>;

  QueryBuilderType!: BaseQueryBuilder<this>;
  static QueryBuilder = BaseQueryBuilder;

  constructor(public readonly schema: AnyObjectSchema) {
    super();
  }

  static createValidator() {
    return new YupValidator();
  }

  static get isSoftDelete() {
    return true;
  }

  $parseDatabaseJson(_json: Pojo) {
    const json = super.$parseDatabaseJson(_json);

    return _.omit(json, 'schema');
  }

  $formatDatabaseJson(_json: Pojo) {
    const json = super.$formatDatabaseJson(_json);

    return _.omit(json, 'schema', 'createdAt');
  }

  // This is called when a Model is converted to JSON. Converts the JSON object from the internal format to the external format.
  $formatJson(_json: Pojo) {
    const json = super.$formatJson(_json);

    return _.omit(json, 'schema'); // TODO: Find better way
  }

  // This is called when a Model is created from a JSON object. Converts the JSON object from the external format to the internal format.
  $parseJson(_json: Pojo, options: ModelOptions) {
    const json = super.$parseJson(_json, { patch: true, ...options }); // removes BaseModel schema validation (id, deletedAt, etc...)

    return _.omit(json, 'schema', 'deletedAt'); // reserved?
  }
}
