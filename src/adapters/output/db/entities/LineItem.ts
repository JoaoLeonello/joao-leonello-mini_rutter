import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ShopifyOrder } from './ShopifyOrder';
import { ShopifyProduct } from './ShopifyProduct';

@Entity('line_item')
export class LineItem {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column('int')
    quantity: number;

    @ManyToOne(() => ShopifyProduct, { nullable: true })
    @JoinColumn({ name: 'product_id' })
    product: ShopifyProduct | null;

    @ManyToOne(() => ShopifyOrder, (shopifyOrder) => shopifyOrder.line_items)
    @JoinColumn({ name: 'order_id' })
    order: ShopifyOrder | null;

    constructor(quantity: number = 1, product: ShopifyProduct | null, order: ShopifyOrder | null) {
        this.quantity = quantity;
        this.product = product;
        this.order = order;
    }
}