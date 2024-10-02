import { EntityManager, In } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { AppDataSource } from '../../../../config/typeOrmConfig';
import { LineItem, Order } from '../../../../domain/entities/Order';
import { Product } from '../../../../domain/entities/Product';
import { LineItemDTO, MoneyDTO, MoneySetDTO, PaymentScheduleDTO, PaymentTermsDTO, ShopifyOrderDTO } from '../../../input/shopify/dto/ShopifyOrderDTO';
import { ImageDTO, OptionDTO, ShopifyProductDTO, VariantDTO } from '../../../input/shopify/dto/ShopifyProductDTO';
import { DatabaseRepository } from '../DatabaseRepository';
import { ShopifyOrder } from '../entities/ShopifyOrder';
import { ShopifyProduct } from '../entities/ShopifyProduct';

jest.mock('../../../../config/typeOrmConfig', () => ({
  AppDataSource: {
    transaction: jest.fn()
  }
}));

jest.mock('uuid', () => ({
    v4: jest.fn()
}));

describe('DatabaseRepository', () => {
    let repository: DatabaseRepository;
    let entityManagerMock: EntityManager;

        beforeEach(() => {
            repository = new DatabaseRepository();

            entityManagerMock = {
                find: jest.fn(),
                findOne: jest.fn(),
                findBy: jest.fn(),
                upsert: jest.fn()
            } as unknown as EntityManager;
        
            (AppDataSource.transaction as jest.Mock).mockImplementation(async (callback: any) => {
                await callback(entityManagerMock);
            });

            (AppDataSource.manager as any) = {
                find: jest.fn()
            };

            jest.spyOn(console, 'error').mockImplementation(() => {});
        });

    function createShopifyProductDTOBatch(): ShopifyProductDTO[] {
        return [
        new ShopifyProductDTO(
            1, // id
            'Product 1', // title
            '<p>Product description</p>', // body_html
            'Vendor 1', // vendor
            'Type 1', // product_type
            '2024-09-30T00:00:00Z', // created_at
            'product-1', // handle
            '2024-09-30T00:00:00Z', // updated_at
            null, // published_at
            null, // template_suffix
            'global', // published_scope
            'Tag1,Tag2', // tags
            'active', // status
            'gid://shopify/Product/1', // admin_graphql_api_id
            // variants
            [
            new VariantDTO(
                1, // id
                1, // product_id
                'Variant 1', // title
                '19.99', // price
                1, // position
                'deny', // inventory_policy
                null, // compare_at_price
                null, // option1
                null, // option2
                null, // option3
                '2024-09-30T00:00:00Z', // created_at
                '2024-09-30T00:00:00Z', // updated_at
                true, // taxable
                'manual', // fulfillment_service
                500, // grams
                null, // inventory_management
                true, // requires_shipping
                'SKU1', // sku
                1.5, // weight
                'kg', // weight_unit
                1001, // inventory_item_id
                10, // inventory_quantity
                0, // old_inventory_quantity
                'gid://shopify/ProductVariant/1', // admin_graphql_api_id
                null // image_id
            ),
            ],
            // options
            [
            new OptionDTO(
                1, // id
                1, // product_id
                'Size', // name
                1, // position
                ['Small', 'Medium', 'Large'] // values
            ),
            ],
            // images
            [
            new ImageDTO(
                1, // id
                1, // product_id
                1, // position
                'https://example.com/image1.jpg', // src
                500, // width
                500, // height
                [1], // variant_ids
                '2024-09-30T00:00:00Z', // created_at
                '2024-09-30T00:00:00Z', // updated_at
                'gid://shopify/Image/1' // admin_graphql_api_id
            ),
            ],
            // main image
            new ImageDTO(
            1, // id
            1, // product_id
            1, // position
            'https://example.com/image1.jpg', // src
            500, // width
            500, // height
            [1], // variant_ids
            '2024-09-30T00:00:00Z', // created_at
            '2024-09-30T00:00:00Z', // updated_at
            'gid://shopify/Image/1' // admin_graphql_api_id
            )
        ),
        ];
    }

    function createShopifyOrderDTOBatch(): ShopifyOrderDTO[] {
        return [
        new ShopifyOrderDTO(
            1, // id
            'gid://shopify/Order/1', // admin_graphql_api_id
            null, // app_id
            '127.0.0.1', // browser_ip
            true, // buyer_accepts_marketing
            null, // cancel_reason
            null, // cancelled_at
            null, // cart_token
            456, // checkout_id
            'token123', // checkout_token
            null, // client_details
            null, // closed_at
            null, // company
            'CONF123', // confirmation_number
            true, // confirmed
            '2024-09-30T00:00:00Z', // created_at
            'USD', // currency
            '100.00', // current_subtotal_price
            null, // current_subtotal_price_set
            null, // current_total_additional_fees_set
            '10.00', // current_total_discounts
            null, // current_total_discounts_set
            null, // current_total_duties_set
            '120.00', // current_total_price
            null, // current_total_price_set
            '20.00', // current_total_tax
            null, // current_total_tax_set
            'en-US', // customer_locale
            null, // device_id
            [], // discount_codes
            false, // estimated_taxes
            'paid', // financial_status
            null, // fulfillment_status
            null, // landing_site
            null, // landing_site_ref
            null, // location_id
            null, // merchant_of_record_app_id
            'Order #1001', // name
            null, // note
            [], // note_attributes
            1001, // number
            1001, // order_number
            null, // original_total_additional_fees_set
            null, // original_total_duties_set
            ['gateway_name'], // payment_gateway_names
            null, // po_number
            'USD', // presentment_currency
            '2024-09-30T01:00:00Z', // processed_at
            null, // reference
            null, // referring_site
            null, // source_identifier
            'online', // source_name
            null, // source_url
            '100.00', // subtotal_price
            null, // subtotal_price_set
            'Tag1,Tag2', // tags
            false, // tax_exempt
            [], // tax_lines
            false, // taxes_included
            false, // test
            'token', // token
            '10.00', // total_discounts
            null, // total_discounts_set
            '100.00', // total_line_items_price
            null, // total_line_items_price_set
            '0.00', // total_outstanding
            '120.00', // total_price
            null, // total_price_set
            null, // total_shipping_price_set
            '20.00', // total_tax
            null, // total_tax_set
            '0.00', // total_tip_received
            500, // total_weight
            null, // updated_at
            123, // user_id
            null, // billing_address
            null, // customer
            [], // discount_applications
            [], // fulfillments
            // Line items
            [
            new LineItemDTO(
                1, // id
                'gid://shopify/LineItem/1', // admin_graphql_api_id
                1, // fulfillable_quantity
                'manual', // fulfillment_service
                null, // fulfillment_status
                false, // gift_card
                200, // grams
                'Product 1', // name
                '100.00', // price
                new MoneySetDTO(new MoneyDTO('100.00', 'USD'), new MoneyDTO('100.00', 'USD')), // price_set
                true, // product_exists
                1, // product_id
                [], // properties
                1, // quantity
                true, // requires_shipping
                'SKU1', // sku
                true, // taxable
                'Product 1', // title
                '0.00', // total_discount
                new MoneySetDTO(new MoneyDTO('0.00', 'USD'), new MoneyDTO('0.00', 'USD')), // total_discount_set
                101, // variant_id
                null, // variant_inventory_management
                null, // variant_title
                'Vendor 1', // vendor
                [], // tax_lines
                [], // duties
                [] // discount_allocations
            )
            ],
            new PaymentTermsDTO(
                1, // id
                '2024-09-30T00:00:00Z', // created_at
                30, // due_in_days
                [
                new PaymentScheduleDTO(
                    1, // id
                    '120.00', // amount
                    'USD', // currency
                    '2024-10-30T00:00:00Z', // issued_at
                    '2024-11-30T00:00:00Z', // due_at
                    null, // completed_at
                    '2024-09-30T00:00:00Z', // created_at
                    '2024-09-30T00:00:00Z' // updated_at
                )
                ], // payment_schedules
                'Net 30', // payment_terms_name
                'net', // payment_terms_type
                '2024-09-30T00:00:00Z' // updated_at
            ),
            [], // refunds
            null, // shipping_address
            [] // shipping_lines
        ),
        ];
    }

    function createShopifyProductBatch(): ShopifyProduct[] {
        const product1 = new ShopifyProduct(
            1234567890,               // platform_id
            'Product 1',              // title
            '<p>Product 1 description</p>',  // body_html
            'Vendor 1',               // vendor
            'Product Type 1',         // product_type
            new Date('2024-01-01T00:00:00Z'), // created_at
            new Date('2024-01-02T00:00:00Z'), // updated_at
            'active',                 // status
            new Date('2024-01-03T00:00:00Z'), // published_at
            null,                     // template_suffix
            'global',                 // published_scope
            'tag1, tag2',             // tags
            'gid://shopify/Product/1' // admin_graphql_api_id
        );

        const product2 = new ShopifyProduct(
            9876543210,               // platform_id
            'Product 2',              // title
            '<p>Product 2 description</p>',  // body_html
            'Vendor 2',               // vendor
            'Product Type 2',         // product_type
            new Date('2024-02-01T00:00:00Z'), // created_at
            new Date('2024-02-02T00:00:00Z'), // updated_at
            'active',                 // status
            null,                     // published_at
            null,                     // template_suffix
            'web',                    // published_scope
            'tag3, tag4',             // tags
            'gid://shopify/Product/2' // admin_graphql_api_id
        );

        return [product1, product2];
    }

    function mockShopifyOrderEntities(): ShopifyOrder[] {
        return [
            {
                id: 'order-1',
                platform_id: 1233231321321,
                admin_graphql_api_id: 'gid://shopify/Order/1233231321321',
                app_id: 12345,
                browser_ip: '192.168.1.1',
                buyer_accepts_marketing: false,
                cancel_reason: null,
                cancelled_at: null,
                cart_token: null,
                checkout_id: 35095163470061,
                checkout_token: 'checkout-token-1',
                confirmation_number: 'CONF123',
                confirmed: true,
                created_at: new Date(),
                currency: 'USD',
                current_subtotal_price: '100.00',
                current_total_price: '110.00',
                current_total_tax: '10.00',
                customer_locale: 'en',
                financial_status: 'paid',
                fulfillment_status: 'fulfilled',
                landing_site: 'landing-site',
                name: 'Order 1035',
                order_number: 1035,
                presentment_currency: 'USD',
                processed_at: new Date(),
                reference: 'ref-123',
                referring_site: 'ref-site',
                source_name: 'shopify',
                subtotal_price: '100.00',
                tags: 'tag1, tag2',
                tax_exempt: false,
                total_discounts: '0.00',
                total_line_items_price: '100.00',
                total_price: '110.00',
                total_tax: '10.00',
                total_tip_received: null,
                updated_at: new Date(),
                user_id: 123456,
                line_items: [
                    {
                        id: 'item-1',
                        quantity: 1,
                        product: new ShopifyProduct(
                            123456789,  // platform_id
                            'Product Title',  // title
                            'This is the body HTML of the product.',  // body_html
                            'Vendor Name',  // vendor
                            'Product Type',  // product_type
                            new Date('2024-10-01'),  // created_at
                            new Date('2024-10-02'),  // updated_at
                            'active',  // status
                            new Date('2024-10-03'),  // published_at
                            'default-template',  // template_suffix
                            'global',  // published_scope
                            'tag1, tag2, tag3',  // tags
                            'gid://shopify/Product/123456789'  // admin_graphql_api_id
                        ),
                        order: new ShopifyOrder(
                            'order-uuid-1',  // id
                            123456789,  // platform_id
                            'gid://shopify/Order/123456789',  // admin_graphql_api_id
                            true,  // buyer_accepts_marketing
                            'CONFIRM123',  // confirmation_number
                            true,  // confirmed
                            new Date('2024-10-01'),  // created_at
                            'USD',  // currency
                            '100.00',  // current_subtotal_price
                            '110.00',  // current_total_price
                            '10.00',  // current_total_tax
                            'en-US',  // customer_locale
                            'paid',  // financial_status
                            'Order Name',  // name
                            1234,  // order_number
                            'USD',  // presentment_currency
                            new Date('2024-10-01'),  // processed_at
                            'shopify',  // source_name
                            '100.00',  // subtotal_price
                            'some-tag',  // tags
                            false,  // tax_exempt
                            '0.00',  // total_discounts
                            '100.00',  // total_line_items_price
                            '110.00',  // total_price
                            '10.00',  // total_tax
                            987654321,  // user_id (optional)
                            new Date('2024-10-02'),  // updated_at (optional)
                            987654321,  // checkout_id
                            'checkout-token-123'  // checkout_token (optional)
                        )
                    }
                ]
            },
            {
                id: 'order-2',
                platform_id: 1233231321322,
                admin_graphql_api_id: 'gid://shopify/Order/1233231321322',
                app_id: null,
                browser_ip: '192.168.1.2',
                buyer_accepts_marketing: true,
                cancel_reason: null,
                cancelled_at: null,
                cart_token: null,
                checkout_id: 35095163470062,
                checkout_token: 'checkout-token-2',
                confirmation_number: 'CONF124',
                confirmed: true,
                created_at: new Date(),
                currency: 'USD',
                current_subtotal_price: '150.00',
                current_total_price: '160.00',
                current_total_tax: '10.00',
                customer_locale: 'en',
                financial_status: 'pending',
                fulfillment_status: null,
                landing_site: 'landing-site-2',
                name: 'Order 1036',
                order_number: 1036,
                presentment_currency: 'USD',
                processed_at: new Date(),
                reference: 'ref-124',
                referring_site: null,
                source_name: 'shopify',
                subtotal_price: '150.00',
                tags: 'tag3, tag4',
                tax_exempt: true,
                total_discounts: '5.00',
                total_line_items_price: '145.00',
                total_price: '160.00',
                total_tax: '15.00',
                total_tip_received: null,
                updated_at: new Date(),
                user_id: null,
                line_items: [
                    {
                        id: 'item-1',
                        quantity: 1,
                        product: new ShopifyProduct(
                            123456789,  // platform_id
                            'Product Title',  // title
                            'This is the body HTML of the product.',  // body_html
                            'Vendor Name',  // vendor
                            'Product Type',  // product_type
                            new Date('2024-10-01'),  // created_at
                            new Date('2024-10-02'),  // updated_at
                            'active',  // status
                            new Date('2024-10-03'),  // published_at
                            'default-template',  // template_suffix
                            'global',  // published_scope
                            'tag1, tag2, tag3',  // tags
                            'gid://shopify/Product/123456789'  // admin_graphql_api_id
                        ),
                        order: new ShopifyOrder(
                            'order-uuid-1',  // id
                            123456789,  // platform_id
                            'gid://shopify/Order/123456789',  // admin_graphql_api_id
                            true,  // buyer_accepts_marketing
                            'CONFIRM123',  // confirmation_number
                            true,  // confirmed
                            new Date('2024-10-01'),  // created_at
                            'USD',  // currency
                            '100.00',  // current_subtotal_price
                            '110.00',  // current_total_price
                            '10.00',  // current_total_tax
                            'en-US',  // customer_locale
                            'paid',  // financial_status
                            'Order Name',  // name
                            1234,  // order_number
                            'USD',  // presentment_currency
                            new Date('2024-10-01'),  // processed_at
                            'shopify',  // source_name
                            '100.00',  // subtotal_price
                            'some-tag',  // tags
                            false,  // tax_exempt
                            '0.00',  // total_discounts
                            '100.00',  // total_line_items_price
                            '110.00',  // total_price
                            '10.00',  // total_tax
                            987654321,  // user_id (optional)
                            new Date('2024-10-02'),  // updated_at (optional)
                            987654321,  // checkout_id
                            'checkout-token-123'  // checkout_token (optional)
                        )
                    }
                ]
            }
        ];
    }
    
    
  

    describe('DatabaseRepository', () => {
        it('should store products in the database', async () => {
        // Mock data for ShopifyProductDTO
        const shopifyProductBatch: ShopifyProductDTO[] = createShopifyProductDTOBatch();

        // Mock transaction and upsert
        const upsertMock = jest.fn();
        (AppDataSource.transaction as jest.Mock).mockImplementation(async (callback: any) => {
            const fakeEntityManager = {
            upsert: upsertMock
            };
            await callback(fakeEntityManager);
        });

        // Execute the storeProducts method
        await repository.storeProducts(shopifyProductBatch);

        // Assert that upsert was called with correct arguments
        expect(upsertMock).toHaveBeenCalledTimes(1);
        expect(upsertMock).toHaveBeenCalledWith(ShopifyProduct, expect.any(ShopifyProduct), ['platform_id']);
        });

        it('should throw an error when there is an issue with saving products', async () => {
        // Mock transaction to throw an error
        (AppDataSource.transaction as jest.Mock).mockImplementation(async () => {
            throw new Error('Database error');
        });

        await expect(repository.storeProducts([])).rejects.toThrow('Error on saving products on database.');
        });


        // store orders

        it('should correctly map ShopifyProductDTO to ShopifyProduct', () => {
        const shopifyProductBatch: ShopifyProductDTO[] = [
            new ShopifyProductDTO(
            1, // id
            'Product 1', // title
            '<p>Product description</p>', // body_html
            'Vendor 1', // vendor
            'Type 1', // product_type
            '2024-09-30T00:00:00Z', // created_at
            'product-1', // handle
            '2024-09-30T00:00:00Z', // updated_at
            null, // published_at
            null, // template_suffix
            'global', // published_scope
            'Tag1,Tag2', // tags
            'active', // status
            'gid://shopify/Product/1', // admin_graphql_api_id
            [], // variants 
            [], // options 
            [], // images 
            null // image 
            )
        ];

        const expectedShopifyProduct = new ShopifyProduct(
            1, // platform_id
            'Product 1', // title
            '<p>Product description</p>', // body_html
            'Vendor 1', // vendor
            'Type 1', // product_type
            new Date('2024-09-30T00:00:00Z'), // created_at
            new Date('2024-09-30T00:00:00Z'), // updated_at
            'active', // status
            null, // published_at 
            null, // template_suffix 
            'global', // published_scope
            'Tag1,Tag2', // tags
            'gid://shopify/Product/1' // admin_graphql_api_id
        );

        const result = repository.mapShopifyProductDTOToShopifyProduct(shopifyProductBatch);

        expect(result).toEqual([expectedShopifyProduct]);
        });

        it('should fetch products from the database and map them to domain entities', async () => {
            const mockProductEntities = [
                {
                id: '1',
                platform_id: '123',
                title: 'Product 1'
                },
                {
                id: '2',
                platform_id: '124',
                title: 'Product 2'
                }
            ];
        
            const expectedProducts: Product[] = [
            new Product('1', '123', 'Product 1'),
            new Product('2', '124', 'Product 2')
            ];
        
            (AppDataSource.manager.find as jest.Mock).mockResolvedValue(mockProductEntities);
        
            const result = await repository.getProducts();
        
            expect(result).toEqual(expectedProducts);
            expect(AppDataSource.manager.find).toHaveBeenCalled();
        });

        it('should throw an error if fetching products fails', async () => {
            (entityManagerMock.find as jest.Mock).mockRejectedValue(new Error('Database error'));
            await expect(repository.getProducts()).rejects.toThrow('Error fetching products from the database');
            expect(console.error).toHaveBeenCalledWith('Error fetching products:', expect.any(Error));
        });

        it('should map product persistence entities to domain entities', () => {
            //mocking uuids
            (uuidv4 as jest.Mock).mockReturnValueOnce('53ef6ae8-4ea7-4882-8fd1-e828804b8b5a')
                          .mockReturnValueOnce('2ae33656-f630-4444-86d5-bc0160620d16');

            const mockProductEntities = createShopifyProductBatch();

            const expectedProducts: Product[] = [
                new Product('53ef6ae8-4ea7-4882-8fd1-e828804b8b5a', '1234567890', 'Product 1'),
                new Product('2ae33656-f630-4444-86d5-bc0160620d16', '9876543210', 'Product 2')
            ];

            const result = repository.mapProductPersistenceEntitytoDomain(mockProductEntities);

            expect(result).toEqual(expectedProducts);
        });
    });
});
