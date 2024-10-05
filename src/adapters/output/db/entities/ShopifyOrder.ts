import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { LineItem } from './LineItem';

@Entity('shopify_order')
export class ShopifyOrder {
    @PrimaryColumn('uuid')
    id: string;

    @Column({ type: 'bigint', unique: true })
    platform_id!: number;

    @Column({ type: 'varchar', length: 255 })
    admin_graphql_api_id!: string;

    @Column({ type: 'boolean', nullable: true })
    buyer_accepts_marketing!: boolean | undefined;

    @Column({ type: 'varchar', length: 255, nullable: true })
    confirmation_number!: string | undefined;

    @Column({ type: 'boolean', nullable: true })
    confirmed!: boolean | undefined;

    @Column({ type: 'timestamp', nullable: true })
    created_at!: Date | undefined;

    @Column({ type: 'varchar', length: 10, nullable: true })
    currency!: string | undefined;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    current_subtotal_price!: string | undefined;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    current_total_price!: string | undefined;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    current_total_tax!: string | undefined;

    @Column({ type: 'varchar', length: 10, nullable: true })
    customer_locale!: string | undefined;

    @Column({ type: 'varchar', length: 255, nullable: true })
    financial_status!: string | undefined;

    @Column({ type: 'varchar', length: 255, nullable: true })
    name!: string | undefined;

    @Column({ type: 'int', nullable: true })
    order_number!: number | undefined;

    @Column({ type: 'varchar', length: 10, nullable: true })
    presentment_currency!: string | undefined;

    @Column({ type: 'timestamp', nullable: true })
    processed_at!: Date | undefined;

    @Column({ type: 'varchar', length: 255, nullable: true })
    source_name!: string | undefined;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    subtotal_price!: string | undefined;

    @Column({ type: 'text', nullable: true })
    tags!: string | undefined;

    @Column({ type: 'boolean', nullable: true })
    tax_exempt!: boolean | undefined;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    total_discounts!: string | undefined;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    total_line_items_price!: string | undefined;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    total_price!: string | undefined;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    total_tax!: string | undefined;

    @Column({ type: 'timestamp', nullable: true })
    updated_at!: Date | null | undefined;

    @Column({ type: 'bigint', nullable: true })
    user_id!: number | null | undefined;

    @Column({ type: 'bigint', nullable: true })
    checkout_id!: number | undefined;

    @Column({ type: 'varchar', length: 255, nullable: true })
    checkout_token!: string | null | undefined;

    @OneToMany(() => LineItem, (lineItem) => lineItem.order, { cascade: false })
    line_items!: LineItem[] | null | undefined;

    constructor(
        id: string = uuidv4(),
        platform_id: number,
        admin_graphql_api_id: string,
        buyer_accepts_marketing?: boolean,
        confirmation_number?: string,
        confirmed?: boolean,
        created_at?: Date,
        currency?: string,
        current_subtotal_price?: string,
        current_total_price?: string,
        current_total_tax?: string,
        customer_locale?: string,
        financial_status?: string,
        name?: string,
        order_number?: number,
        presentment_currency?: string,
        processed_at?: Date,
        source_name?: string,
        subtotal_price?: string,
        tags?: string,
        tax_exempt?: boolean,
        total_discounts?: string,
        total_line_items_price?: string,
        total_price?: string,
        total_tax?: string,
        user_id?: number | null,
        updated_at?: Date | null,
        checkout_id?: number,
        checkout_token?: string | null,
        line_items?: LineItem[] | null
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
        this.line_items = line_items;
    }
}
