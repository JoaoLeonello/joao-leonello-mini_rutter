import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ShopifyOrder } from './ShopifyOrder';
import { ShopifyProduct } from './ShopifyProduct';

@Entity('line_item')
export class LineItem {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => ShopifyProduct, { nullable: true })
    product: ShopifyProduct | null;

    @ManyToOne(() => ShopifyOrder, (shopifyOrder) => shopifyOrder.line_items)
    order: ShopifyOrder | null;

    constructor(product: ShopifyProduct | null, order: ShopifyOrder | null) {
        this.product = product;
        this.order = order;
    }
}