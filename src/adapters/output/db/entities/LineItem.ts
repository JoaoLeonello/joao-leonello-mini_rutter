import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ShopifyOrder } from './ShopifyOrder';
import { ShopifyProduct } from './ShopifyProduct';

@Entity('line_item')
export class LineItem {
    @PrimaryColumn('uuid') 
    id: string;

    @Column({ type: 'bigint', unique: true })
    platform_id: number;
    
    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255 })
    title!: string;

    @Column({ type: 'varchar', length: 255 })
    price!: string;

    @Column({ type: 'varchar', length: 255 })
    vendor!: string;

    @Column('int')
    quantity: number;

    @ManyToOne(() => ShopifyProduct, { nullable: true })
    @JoinColumn({ name: 'product_id' })
    product: ShopifyProduct | null | undefined;

    @ManyToOne(() => ShopifyOrder, (shopifyOrder) => shopifyOrder.line_items)
    @JoinColumn({ name: 'order_id' })
    order: ShopifyOrder | null;

    constructor(
        id: string = uuidv4(),
        platform_id: number,
        name: string,
        title: string,
        price: string,
        vendor: string,
        quantity: number = 1, 
        product: ShopifyProduct | null, 
        order: ShopifyOrder | null,
    ) {
        this.id = id,  // Generate new ID if its new;
        this.platform_id = platform_id,
        this.name = name,
        this.title = title,
        this.price = price,
        this.vendor = vendor,
        this.quantity = quantity;
        this.product = product;
        this.order = order;
    }
}