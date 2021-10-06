import { Knex } from 'knex';

export const baseTable = (table: Knex.CreateTableBuilder, knex?: Knex, columnName = 'id') => {
  tableWithId(table, columnName);
  tableWithCreatedAt(table, knex);
};

export const baseTableWithSoftDelete = (
  table: Knex.CreateTableBuilder,
  knex?: Knex,
  columnName = 'id',
) => {
  tableWithId(table, columnName);
  tableWithSoftDelete(table);
  tableWithCreatedAt(table, knex);
};

export const tableWithId = (table: Knex.CreateTableBuilder, columnName) => {
  table.increments(columnName).primary().unique();
};

export const tableWithCreatedAt = (table: Knex.CreateTableBuilder, knex?: Knex) => {
  if (!knex) throw new Error('Did you forget to pass knex?');

  table.dateTime('created_at').nullable().defaultTo(knex.fn.now());
};

// const trigger = tableWithUpdatedAt(table: .., knex: ..); after table has been created, call trigger();
export const tableWithUpdatedAt = (table: Knex.CreateTableBuilder, knex?: Knex) => {
  if (!knex) throw new Error('Did you forget to pass knex?');

  table.dateTime('updated_at').nullable().defaultTo(knex.fn.now());

  return () =>
    knex.raw(`
  CREATE TRIGGER ${table}_updated_at
  BEFORE UPDATE ON ${table}
  FOR EACH ROW
  EXECUTE PROCEDURE on_update_timestamp();`); // 20210923091420_on_update_timestamp
};

export const tableWithSoftDelete = (table: Knex.CreateTableBuilder) => {
  table.dateTime('deleted_at').nullable();
};

export const tableWithCreatedBy = (table: Knex.CreateTableBuilder, columnName = 'created_by') => {
  table.integer(columnName).nullable();
  table.foreign(columnName).references(`user.id`).onDelete('SET NULL').onUpdate('RESTRICT');

  return table;
};

export const tableWithCurrency = (table: Knex.CreateTableBuilder, columnName: string) => {
  return table.decimal(columnName, 9, 2).nullable().defaultTo('0.00');
};
