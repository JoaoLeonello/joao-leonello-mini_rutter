import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ShopifyOrder } from './ShopifyOrder';
import { ShopifyProduct } from './ShopifyProduct';

@Entity('line_item')
export class LineItem {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ nullable: true })
    product_id: string;

    @ManyToOne(() => ShopifyProduct, { nullable: true })
    product: ShopifyProduct;

    @ManyToOne(() => ShopifyOrder, (shopifyOrder) => shopifyOrder.line_items)
    order: ShopifyOrder;

    constructor(product_id: string, product: ShopifyProduct, order: ShopifyOrder) {
        this.product_id = product_id;
        this.product = product;
        this.order = order;
    }
}