import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { LineItem } from './LineItem';

@Entity('shopify_product')
export class ShopifyProduct {
    @PrimaryColumn('uuid') 
    id: string;

    @Column({ type: 'bigint', unique: true })
    platform_id!: number | null;

    @Column({ type: 'varchar', length: 255 })
    name!: string | null;

    @Column({ type: 'varchar', length: 255 })
    title!: string | null;

    @Column({ type: 'text', nullable: true })
    body_html!: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    vendor!: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    product_type!: string | null;

    @Column({ type: 'timestamp' })
    created_at!: Date;

    @Column({ type: 'timestamp' })
    updated_at!: Date;

    @Column({ type: 'timestamp', nullable: true })
    published_at!: Date | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    template_suffix!: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    published_scope!: string | null;

    @Column({ type: 'text', nullable: true })
    tags!: string | null;

    @Column({ type: 'varchar', length: 255 })
    status!: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    admin_graphql_api_id!: string | null;

    @OneToMany(() => LineItem, (lineItem) => lineItem.product)
    line_items!: LineItem[];

    constructor(
        id: string = uuidv4(),
        platform_id: number | null = null,
        name: string | null,
        title: string | null,
        body_html: string | null,
        vendor: string | null,
        product_type: string | null,
        created_at: Date,
        updated_at: Date,
        status: string,
        published_at: Date | null = null,
        template_suffix: string | null = null,
        published_scope: string | null = null,
        tags: string | null = null,
        admin_graphql_api_id: string | null = null
    ) {
        this.id = id ?? uuidv4();;
        this.platform_id = platform_id;
        this.name = name ?? null;
        this.title = title ?? null;
        this.body_html = body_html ?? null;
        this.vendor = vendor ?? null;
        this.product_type = product_type ?? null;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.status = status ?? '';
        this.published_at = published_at ?? null;
        this.template_suffix = template_suffix ?? null;
        this.published_scope = published_scope ?? null;
        this.tags = tags ?? null;
        this.admin_graphql_api_id = admin_graphql_api_id ?? null;
    }
}