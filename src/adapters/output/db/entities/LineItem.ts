import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ShopifyOrder } from './ShopifyOrder';
import { ShopifyProduct } from './ShopifyProduct';

@Entity('line_item')
export class LineItem {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => ShopifyProduct, (shopifyProduct) => shopifyProduct.line_items, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'product_id' })
    product: ShopifyProduct | null;

    @ManyToOne(() => ShopifyOrder, (shopifyOrder) => shopifyOrder.line_items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_id' })
    order: ShopifyOrder | null;

    constructor(product: ShopifyProduct | null, order: ShopifyOrder | null) {
        this.product = product;
        this.order = order;
    }
}