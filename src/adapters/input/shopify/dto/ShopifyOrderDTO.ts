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
    public client_details: ClientDetailsDTO | null,
    public closed_at: string | null,
    public company: string | null,
    public confirmation_number: string,
    public confirmed: boolean,
    public created_at: string,
    public currency: string,
    public current_subtotal_price: string,
    public current_subtotal_price_set: MoneySetDTO | null,
    public current_total_additional_fees_set: MoneySetDTO | null,
    public current_total_discounts: string,
    public current_total_discounts_set: MoneySetDTO | null,
    public current_total_duties_set: MoneySetDTO | null,
    public current_total_price: string,
    public current_total_price_set: MoneySetDTO | null,
    public current_total_tax: string,
    public current_total_tax_set: MoneySetDTO | null,
    public customer_locale: string,
    public device_id: string | null,
    public discount_codes: any[],
    public estimated_taxes: boolean,
    public financial_status: string,
    public fulfillment_status: string | null,
    public landing_site: string | null,
    public landing_site_ref: string | null,
    public location_id: number | null,
    public merchant_of_record_app_id: number | null,
    public name: string,
    public note: string | null,
    public note_attributes: any[],
    public number: number,
    public order_number: number,
    public original_total_additional_fees_set: MoneySetDTO | null,
    public original_total_duties_set: MoneySetDTO | null,
    public payment_gateway_names: string[],
    public po_number: string | null,
    public presentment_currency: string,
    public processed_at: string,
    public reference: string | null,
    public referring_site: string | null,
    public source_identifier: string | null,
    public source_name: string,
    public source_url: string | null,
    public subtotal_price: string,
    public subtotal_price_set: MoneySetDTO | null,
    public tags: string,
    public tax_exempt: boolean,
    public tax_lines: TaxLineDTO[],
    public taxes_included: boolean,
    public test: boolean,
    public token: string,
    public total_discounts: string,
    public total_discounts_set: MoneySetDTO | null,
    public total_line_items_price: string,
    public total_line_items_price_set: MoneySetDTO | null,
    public total_outstanding: string,
    public total_price: string,
    public total_price_set: MoneySetDTO | null,
    public total_shipping_price_set: MoneySetDTO | null,
    public total_tax: string,
    public total_tax_set: MoneySetDTO | null,
    public total_tip_received: string,
    public total_weight: number,
    public updated_at: string | null,
    public user_id: number | null,
    public billing_address: string | null,
    public customer: string | null,
    public discount_applications: any[],
    public fulfillments: any[],
    public line_items: LineItemDTO[],
    public payment_terms: PaymentTermsDTO | null,
    public refunds: any[],
    public shipping_address: string | null,
    public shipping_lines: any[],
  ) {}
}

export class LineItemDTO {
  constructor(
    public id: number,
    public admin_graphql_api_id: string,
    public fulfillable_quantity: number,
    public fulfillment_service: string,
    public fulfillment_status: string | null,
    public gift_card: boolean,
    public grams: number,
    public name: string,
    public price: string,
    public price_set: MoneySetDTO,
    public product_exists: boolean,
    public product_id: number,
    public properties: any[],
    public quantity: number,
    public requires_shipping: boolean,
    public sku: string | null,
    public taxable: boolean,
    public title: string,
    public total_discount: string,
    public total_discount_set: MoneySetDTO,
    public variant_id: number | null,
    public variant_inventory_management: string | null,
    public variant_title: string | null,
    public vendor: string,
    public tax_lines: TaxLineDTO[],
    public duties: any[],
    public discount_allocations: any[],
  ) {}
}

export class MoneySetDTO {
  constructor(
    public shop_money: MoneyDTO,
    public presentment_money: MoneyDTO,
  ) {}
}

export class MoneyDTO {
  constructor(
    public amount: string,
    public currency_code: string,
  ) {}
}

export class TaxLineDTO {
  constructor(
    public price: string,
    public rate: number,
    public title: string,
    public price_set: MoneySetDTO,
    public channel_liable: boolean,
  ) {}
}

export class ClientDetailsDTO {
  constructor(
    public accept_language: string | null,
    public browser_height: number | null,
    public browser_ip: string | null,
    public browser_width: number | null,
    public session_hash: string | null,
    public user_agent: string | null,
  ) {}
}

export class PaymentTermsDTO {
  constructor(
    public id: number,
    public created_at: string,
    public due_in_days: number | null,
    public payment_schedules: PaymentScheduleDTO[],
    public payment_terms_name: string,
    public payment_terms_type: string,
    public updated_at: string,
  ) {}
}

export class PaymentScheduleDTO {
  constructor(
    public id: number,
    public amount: string,
    public currency: string,
    public issued_at: string | null,
    public due_at: string | null,
    public completed_at: string | null,
    public created_at: string,
    public updated_at: string,
  ) {}
}
