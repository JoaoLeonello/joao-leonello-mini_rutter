export class ShopifyOrderDTO {
    constructor(
      public id: number,
      public admin_graphql_api_id: string,
      public app_id: number | null,
      public browser_ip: string | null,
      public buyer_accepts_marketing: boolean,
      public cancel_reason: string | null,
      public cancelled_at: string | null,
      public cart_token: string | null,
      public checkout_id: number,
      public checkout_token: string,
      public confirmation_number: string,
      public confirmed: boolean,
      public created_at: string,
      public currency: string,
      public current_subtotal_price: string,
      public current_total_price: string,
      public current_total_tax: string,
      public customer_locale: string,
      public financial_status: string,
      public fulfillment_status: string | null,
      public landing_site: string | null,
      public name: string,
      public order_number: number,
      public presentment_currency: string,
      public processed_at: string,
      public reference: string | null,
      public referring_site: string | null,
      public source_name: string,
      public subtotal_price: string,
      public tags: string,
      public tax_exempt: boolean,
      public total_discounts: string,
      public total_line_items_price: string,
      public total_price: string,
      public total_tax: string,
      public total_tip_received: string | null,
      public updated_at: string | null,
      public user_id: number | null,
      public line_items: LineItemDTO[]
    ) {}
  }
  
  export class LineItemDTO {
    constructor(
      public id: number,
      public product_id: number | null, 
      public title: string,
      public quantity: number,
      public price: string,
      public sku: string | null,
      public fulfillment_status: string | null
    ) {}
  }
  