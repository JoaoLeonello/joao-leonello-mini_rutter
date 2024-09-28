import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: 'mysql',
    port: 3306,
    username: 'root',
    password: 'root_password',
    database: 'my_database',
    synchronize: true, 
    logging: true,
    entities: ['src/adapters/output/db/entities/*.ts'],
    migrations: ['src/adapters/output/db/migrations/**/*.ts'],
});