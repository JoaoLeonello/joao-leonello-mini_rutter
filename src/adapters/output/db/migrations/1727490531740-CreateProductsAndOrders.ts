import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateProductsAndOrders1633500000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'shopify_product',
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
                        type: 'bigint',
                    },
                    {
                        name: 'title',
                        type: 'varchar',
                    },
                    {
                        name: 'body_html',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'vendor',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'product_type',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                    },
                    {
                        name: 'status',
                        type: 'varchar',
                    },
                    {
                        name: 'published_at',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'tags',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'published_scope',
                        type: 'varchar',
                        isNullable: true,
                    },
                ],
            }),
            true
        );

        // Criar tabela 'shopify_order'
        await queryRunner.createTable(
            new Table({
                name: 'shopify_order',
                columns: [
                    {
                        name: 'id',
                        type: 'bigint',
                        isPrimary: true,
                    },
                    {
                        name: 'admin_graphql_api_id',
                        type: 'varchar',
                    },
                    {
                        name: 'app_id',
                        type: 'bigint',
                        isNullable: true,
                    },
                    {
                        name: 'browser_ip',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'buyer_accepts_marketing',
                        type: 'boolean',
                    },
                    {
                        name: 'confirmation_number',
                        type: 'varchar',
                    },
                    {
                        name: 'confirmed',
                        type: 'boolean',
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                    },
                    {
                        name: 'currency',
                        type: 'varchar',
                    },
                    {
                        name: 'current_subtotal_price',
                        type: 'varchar',
                    },
                    {
                        name: 'current_total_price',
                        type: 'varchar',
                    },
                    {
                        name: 'current_total_tax',
                        type: 'varchar',
                    },
                    {
                        name: 'customer_locale',
                        type: 'varchar',
                    },
                    {
                        name: 'financial_status',
                        type: 'varchar',
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                    },
                    {
                        name: 'order_number',
                        type: 'int',
                    },
                    {
                        name: 'processed_at',
                        type: 'timestamp',
                    },
                    {
                        name: 'subtotal_price',
                        type: 'varchar',
                    },
                    {
                        name: 'tags',
                        type: 'varchar',
                    },
                    {
                        name: 'tax_exempt',
                        type: 'boolean',
                    },
                    {
                        name: 'total_discounts',
                        type: 'varchar',
                    },
                    {
                        name: 'total_line_items_price',
                        type: 'varchar',
                    },
                    {
                        name: 'total_price',
                        type: 'varchar',
                    },
                    {
                        name: 'total_tax',
                        type: 'varchar',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        isNullable: true,
                    },
                ],
            }),
            true
        );

        // Criar tabela 'line_item'
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

        // Criar chaves estrangeiras
        await queryRunner.createForeignKey(
            'line_item',
            new TableForeignKey({
                columnNames: ['product_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'shopify_product',
                onDelete: 'CASCADE',
            })
        );

        await queryRunner.createForeignKey(
            'line_item',
            new TableForeignKey({
                columnNames: ['order_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'shopify_order',
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
        await queryRunner.dropTable('shopify_order');
        await queryRunner.dropTable('shopify_product');
    }
}
