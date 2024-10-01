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
                        length: '255',
                    },
                    {
                        name: 'body_html',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'vendor',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                    },
                    {
                        name: 'product_type',
                        type: 'varchar',
                        length: '255',
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
                        name: 'published_at',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'status',
                        type: 'varchar',
                        length: '255',
                    },
                    {
                        name: 'tags',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'published_scope',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                    },
                    {
                        name: 'template_suffix',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                    },
                    {
                        name: 'admin_graphql_api_id',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                    },
                ],
            }),
            true
        );

        await queryRunner.createTable(
            new Table({
                name: 'shopify_order',
                columns: [
                    {
                        name: 'id',
                        type: 'char',
                        length: '36',
                        isPrimary: true,
                    },
                    {
                        name: 'platform_id',
                        type: 'char',
                        length: '36',
                    },
                    {
                        name: 'admin_graphql_api_id',
                        type: 'varchar',
                        length: '255',
                    },
                    {
                        name: 'app_id',
                        type: 'bigint',
                        isNullable: true,
                    },
                    {
                        name: 'browser_ip',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                    },
                    {
                        name: 'buyer_accepts_marketing',
                        type: 'boolean',
                    },
                    {
                        name: 'cancel_reason',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                    },
                    {
                        name: 'cancelled_at',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'cart_token',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                    },
                    {
                        name: 'checkout_id',
                        type: 'bigint',
                    },
                    {
                        name: 'checkout_token',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                    },
                    {
                        name: 'confirmation_number',
                        type: 'varchar',
                        length: '255',
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
                        length: '10',
                    },
                    {
                        name: 'current_subtotal_price',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                    },
                    {
                        name: 'current_total_price',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                    },
                    {
                        name: 'current_total_tax',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                    },
                    {
                        name: 'customer_locale',
                        type: 'varchar',
                        length: '10',
                    },
                    {
                        name: 'financial_status',
                        type: 'varchar',
                        length: '255',
                    },
                    {
                        name: 'fulfillment_status',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                    },
                    {
                        name: 'landing_site',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        length: '255',
                    },
                    {
                        name: 'order_number',
                        type: 'int',
                    },
                    {
                        name: 'presentment_currency',
                        type: 'varchar',
                        length: '10',
                    },
                    {
                        name: 'processed_at',
                        type: 'timestamp',
                    },
                    {
                        name: 'reference',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                    },
                    {
                        name: 'referring_site',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                    },
                    {
                        name: 'source_name',
                        type: 'varchar',
                        length: '255',
                    },
                    {
                        name: 'subtotal_price',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                    },
                    {
                        name: 'tags',
                        type: 'text',
                    },
                    {
                        name: 'tax_exempt',
                        type: 'boolean',
                    },
                    {
                        name: 'total_discounts',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                    },
                    {
                        name: 'total_line_items_price',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                    },
                    {
                        name: 'total_price',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                    },
                    {
                        name: 'total_tax',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                    },
                    {
                        name: 'total_tip_received',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                        isNullable: true,
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'user_id',
                        type: 'bigint',
                        isNullable: true,
                    },
                    {
                        name: 'payment_gateway_names',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'total_discounts_set',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'total_price_set',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'total_tax_set',
                        type: 'text',
                        isNullable: true,
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
                        name: 'quantity',
                        type: 'int',
                        isNullable: true
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
