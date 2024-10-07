export class ShopifyProductDTO {
  constructor(
    public id: number,
    public title: string,
    public body_html: string,
    public vendor: string,
    public product_type: string,
    public created_at: string,
    public handle: string,
    public updated_at: string,
    public published_at: string | null,
    public template_suffix: string | null,
    public published_scope: string,
    public tags: string,
    public status: string,
    public admin_graphql_api_id: string,
    public variants: VariantDTO[],
    public options: OptionDTO[],
    public images: ImageDTO[],
    public image: ImageDTO | null,
  ) {}
}

export class VariantDTO {
  constructor(
    public id: number,
    public product_id: number,
    public title: string,
    public price: string,
    public position: number,
    public inventory_policy: string,
    public compare_at_price: string | null,
    public option1: string | null,
    public option2: string | null,
    public option3: string | null,
    public created_at: string,
    public updated_at: string,
    public taxable: boolean,
    public fulfillment_service: string,
    public grams: number,
    public inventory_management: string | null,
    public requires_shipping: boolean,
    public sku: string,
    public weight: number,
    public weight_unit: string,
    public inventory_item_id: number,
    public inventory_quantity: number,
    public old_inventory_quantity: number,
    public admin_graphql_api_id: string,
    public image_id: number | null,
  ) {}
}

export class OptionDTO {
  constructor(
    public id: number,
    public product_id: number,
    public name: string,
    public position: number,
    public values: string[],
  ) {}
}

export class ImageDTO {
  constructor(
    public id: number,
    public product_id: number,
    public position: number,
    public src: string,
    public width: number,
    public height: number,
    public variant_ids: number[],
    public created_at: string,
    public updated_at: string,
    public admin_graphql_api_id: string,
  ) {}
}
