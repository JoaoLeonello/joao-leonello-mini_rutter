import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { LineItem } from './LineItem';

@Entity('shopify_order')
export class ShopifyOrder {
    @PrimaryColumn('uuid') 
    id!: string;

    @Column({ type: 'bigint', unique: true })
    platform_id!: number;

    @Column({ type: 'varchar', length: 255 })
    admin_graphql_api_id!: string;

    @Column({ type: 'bigint', nullable: true })
    app_id!: number | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    browser_ip!: string | null;

    @Column({ type: 'boolean' })
    buyer_accepts_marketing!: boolean;

    @Column({ type: 'varchar', length: 255, nullable: true })
    cancel_reason!: string | null;

    @Column({ type: 'timestamp', nullable: true })
    cancelled_at!: Date | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    cart_token!: string | null;

    @Column({ type: 'bigint' })
    checkout_id!: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    checkout_token!: string | null; 

    @Column({ type: 'varchar', length: 255 })
    confirmation_number!: string;

    @Column({ type: 'boolean' })
    confirmed!: boolean;

    @Column({ type: 'timestamp' })
    created_at!: Date;

    @Column({ type: 'varchar', length: 10 })
    currency!: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    current_subtotal_price!: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    current_total_price!: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    current_total_tax!: string;

    @Column({ type: 'varchar', length: 10 })
    customer_locale!: string;

    @Column({ type: 'varchar', length: 255 })
    financial_status!: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    fulfillment_status!: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    landing_site!: string | null;

    @Column({ type: 'varchar', length: 255 })
    name!: string;

    @Column({ type: 'int' })
    order_number!: number;

    @Column({ type: 'varchar', length: 10 })
    presentment_currency!: string;

    @Column({ type: 'timestamp' })
    processed_at!: Date;

    @Column({ type: 'varchar', length: 255, nullable: true })
    reference!: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    referring_site!: string | null;

    @Column({ type: 'varchar', length: 255 })
    source_name!: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    subtotal_price!: string;

    @Column({ type: 'text' })
    tags!: string;

    @Column({ type: 'boolean' })
    tax_exempt!: boolean;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total_discounts!: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total_line_items_price!: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total_price!: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total_tax!: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    total_tip_received!: string | null;

    @Column({ type: 'timestamp', nullable: true })
    updated_at!: Date | null;

    @Column({ type: 'bigint', nullable: true })
    user_id!: number | null;

    @OneToMany(() => LineItem, (lineItem) => lineItem.order, { cascade: true })
    line_items!: LineItem[];

    constructor(
        id: string,
        platform_id: number,
        admin_graphql_api_id: string,
        buyer_accepts_marketing: boolean,
        confirmation_number: string,
        confirmed: boolean,
        created_at: Date,
        currency: string,
        current_subtotal_price: string,
        current_total_price: string,
        current_total_tax: string,
        customer_locale: string,
        financial_status: string,
        name: string,
        order_number: number,
        presentment_currency: string,
        processed_at: Date,
        source_name: string,
        subtotal_price: string,
        tags: string,
        tax_exempt: boolean,
        total_discounts: string,
        total_line_items_price: string,
        total_price: string,
        total_tax: string,
        user_id: number | null = null,
        updated_at: Date | null = null,
        checkout_id: number,
        checkout_token: string | null, 
    ) {
        this.id = id;
        this.platform_id = platform_id;
        this.admin_graphql_api_id = admin_graphql_api_id;
        this.buyer_accepts_marketing = buyer_accepts_marketing;
        this.confirmation_number = confirmation_number;
        this.confirmed = confirmed;
        this.created_at = created_at;
        this.currency = currency;
        this.current_subtotal_price = current_subtotal_price;
        this.current_total_price = current_total_price;
        this.current_total_tax = current_total_tax;
        this.customer_locale = customer_locale;
        this.financial_status = financial_status;
        this.name = name;
        this.order_number = order_number;
        this.presentment_currency = presentment_currency;
        this.processed_at = processed_at;
        this.source_name = source_name;
        this.subtotal_price = subtotal_price;
        this.tags = tags;
        this.tax_exempt = tax_exempt;
        this.total_discounts = total_discounts;
        this.total_line_items_price = total_line_items_price;
        this.total_price = total_price;
        this.total_tax = total_tax;
        this.user_id = user_id;
        this.updated_at = updated_at;
        this.checkout_id = checkout_id;
        this.checkout_token = checkout_token; 
    }
}