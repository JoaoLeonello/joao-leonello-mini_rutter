import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ShopifyOrder } from './ShopifyOrder';
import { ShopifyProduct } from './ShopifyProduct';

@Entity('line_item')
export class LineItem {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    product_id: string | null;

    @ManyToOne(() => ShopifyProduct, { nullable: true })
    product: ShopifyProduct | null;

    @ManyToOne(() => ShopifyOrder, (shopifyOrder) => shopifyOrder.line_items)
    order: ShopifyOrder | null;

    constructor(product_id: string | null, product: ShopifyProduct | null, order: ShopifyOrder | null) {
        this.product_id = product_id;
        this.product = product;
        this.order = order;
    }
}