import type stream from 'stream';

// Config object for pg: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/pg/index.d.ts
interface PgConnectionConfig {
  user?: string;
  database?: string;
  password?: string;
  port?: number;
  host?: string;
  connectionString?: string;
  keepAlive?: boolean;
  stream?: stream.Duplex;
  statement_timeout?: false | number;
  connectionTimeoutMillis?: number;
  keepAliveInitialDelayMillis?: number;
  ssl?: boolean | any;
  application_name?: string;
}

module.exports = {
  development: {
    client: 'pg',
    version: 13,
    connection: {
      connectionString: process.env.DB_CONNECTION_STRING,
      ssl: process.env.DEV
        ? false
        : {
            rejectUnauthorized: false,
          },
    } as PgConnectionConfig,
    migrations: {
      tableName: 'knex_migrations',
      directory: './libs/migrations/src',
    },
  },
};
