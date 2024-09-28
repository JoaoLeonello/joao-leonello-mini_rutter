import { DataSource } from 'typeorm';
import { LineItem, Order, Product } from '../adapters/output/db/entities';

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root_password',
    database: 'my_database',
    synchronize: true, 
    logging: true,
    entities: [Product, Order, LineItem], // Caminho para as entidades
    migrations: ['src/adapters/output/db/migrations/**/*.ts'], // Caminho para as migrations
});