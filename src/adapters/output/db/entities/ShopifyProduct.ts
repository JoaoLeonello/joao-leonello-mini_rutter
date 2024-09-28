import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('shopify_product')
export class ShopifyProduct {
    @PrimaryColumn({ type: 'bigint' })
    id!: number;

    @Column({ type: 'varchar', length: 255 })
    title!: string;

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

    constructor(
        id: number,
        title: string,
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
        this.id = id;
        this.title = title;
        this.body_html = body_html;
        this.vendor = vendor;
        this.product_type = product_type;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.status = status;
        this.published_at = published_at;
        this.template_suffix = template_suffix;
        this.published_scope = published_scope;
        this.tags = tags;
        this.admin_graphql_api_id = admin_graphql_api_id;
    }
}
