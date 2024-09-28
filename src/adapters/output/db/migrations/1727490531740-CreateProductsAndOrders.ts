import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateProductsAndOrders1633500000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'product',
                columns: [
                    {
                        name: 'id',
                        type: 'char',
                        length: '36', 
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'uuid',
                    },
                    {
                        name: 'platform_id',
                        type: 'varchar',
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                    },
                ],
            }),
            true
        );

        await queryRunner.createTable(
            new Table({
                name: 'order',
                columns: [
                    {
                        name: 'id',
                        type: 'char',
                        length: '36', 
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'uuid',
                    },
                    {
                        name: 'platform_id',
                        type: 'varchar',
                    },
                ],
            }),
            true
        );

        await queryRunner.createTable(
            new Table({
                name: 'line_item',
                columns: [
                    {
                        name: 'id',
                        type: 'char',
                        length: '36', 
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'uuid',
                    },
                    {
                        name: 'product_id',
                        type: 'char',
                        length: '36',
                        isNullable: true,
                    },
                    {
                        name: 'order_id',
                        type: 'char',
                        length: '36',  
                    },
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            'line_item',
            new TableForeignKey({
                columnNames: ['product_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'product',
                onDelete: 'CASCADE',
            })
        );

        await queryRunner.createForeignKey(
            'line_item',
            new TableForeignKey({
                columnNames: ['order_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'order',
                onDelete: 'CASCADE',
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const lineItemTable = await queryRunner.getTable('line_item');
        if (lineItemTable) {
            const foreignKeyOrder = lineItemTable.foreignKeys.find(fk => fk.columnNames.indexOf('order_id') !== -1);
            if (foreignKeyOrder) await queryRunner.dropForeignKey('line_item', foreignKeyOrder);

            const foreignKeyProduct = lineItemTable.foreignKeys.find(fk => fk.columnNames.indexOf('product_id') !== -1);
            if (foreignKeyProduct) await queryRunner.dropForeignKey('line_item', foreignKeyProduct);
        }

        await queryRunner.dropTable('line_item');
        await queryRunner.dropTable('order');
        await queryRunner.dropTable('product');
    }
}
