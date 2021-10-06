import { Model, QueryBuilder, Page } from 'objection';

const softDeleteOptions = {
  columnName: 'deleted_at',
  notDeletedValue: null,
};

export class BaseQueryBuilder<M extends Model, R = M[]> extends QueryBuilder<M, R> {
  ArrayQueryBuilderType!: BaseQueryBuilder<M, M[]>;
  SingleQueryBuilderType!: BaseQueryBuilder<M, M>;
  NumberQueryBuilderType!: BaseQueryBuilder<M, number>;
  PageQueryBuilderType!: BaseQueryBuilder<M, Page<M>>;

  // soft delete
  delete() {
    this.mergeContext({
      softDelete: true,
    });
    const patch = {};
    patch[softDeleteOptions.columnName] = new Date();
    return this.patch(patch);
  }

  // provide a way to actually delete the row if necessary
  hardDelete() {
    return super.delete();
  }

  // provide a way to undo the soft-delete
  undelete() {
    this.mergeContext({
      undelete: true,
    });
    const patch = {};
    patch[softDeleteOptions.columnName] = softDeleteOptions.notDeletedValue;
    return this.patch(patch);
  }

  whereDeleted() {
    return this.whereNot(
      `${this.modelClass().tableName}.${softDeleteOptions.columnName}`,
      softDeleteOptions.notDeletedValue,
    );
  }

  whereNotDeleted() {
    return this.where(
      `${this.modelClass().tableName}.${softDeleteOptions.columnName}`,
      softDeleteOptions.notDeletedValue,
    );
  }
}
