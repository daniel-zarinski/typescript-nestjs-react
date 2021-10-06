import { Knex } from 'knex';
import { baseTableWithSoftDelete } from '../utils';

const tableName = 'user';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(tableName, function (table) {
    baseTableWithSoftDelete(table, knex);

    table.string('email', 255).unique().notNullable().index();
    table.text('password').notNullable();
    table.string('first_name', 100).notNullable();
    table.string('last_name', 100).nullable();
    table.string('phone', 30).nullable();
    table.string('last_ip', 100).nullable();
    table.dateTime('verified_at').nullable();
    table.string('pos_customer_id', 50).nullable();
    table.boolean('is_unsubscribed_marketing').notNullable().defaultTo(false);
    table.string('verification_code', 100).nullable();
    table.specificType('roles', 'varchar[]').notNullable().defaultTo('{user}');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(tableName);
}
