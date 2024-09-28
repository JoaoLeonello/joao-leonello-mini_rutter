import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './Order';
import { Product } from './Product';

@Entity('line_item')
export class LineItem {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ nullable: true })
    product_id: string;

    @ManyToOne(() => Product, { nullable: true })
    product: Product;

    @ManyToOne(() => Order, (order) => order.line_items)
    order: Order;

    constructor(product_id: string, product: Product, order: Order) {
        this.product_id = product_id;
        this.product = product;
        this.order = order;
    }
}