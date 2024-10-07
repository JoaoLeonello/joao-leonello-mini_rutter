import { EntityManager } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import logger from "../../../../config/logger";
import { AppDataSource } from "../../../../config/typeOrmConfig";
import { Order } from "../../../../domain/entities/Order";
import { LineItem as EntityLineItem } from "../entities/LineItem";
import { ShopifyOrder } from "../entities/ShopifyOrder";
import { ShopifyProduct } from "../entities/ShopifyProduct";
import { OrderRepository } from "../OrderRepository";

// Mock dependencies
jest.mock("../../../../config/typeOrmConfig", () => ({
  AppDataSource: {
    getRepository: jest.fn(() => ({
      find: jest.fn(),
    })),
    transaction: jest.fn(),
  },
}));

const mockEntityManager = {
  save: jest.fn(),
  update: jest.fn(),
} as unknown as EntityManager;

const mockOrderRepository = {
  find: jest.fn(),
};

const mockLineItemRepository = {
  find: jest.fn(),
};

const mockProductRepository = {
  find: jest.fn(),
};

jest.spyOn(AppDataSource, "getRepository").mockImplementation((entity) => {
  if (entity === ShopifyOrder) {
    return {
      ...mockOrderRepository,
      find: jest.fn().mockResolvedValue([new ShopifyOrder("1", 1001)]), 
      createQueryBuilder: jest.fn().mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      }),
    } as any;
  }
  if (entity === EntityLineItem) {
    return {
      ...mockLineItemRepository,
      find: jest.fn().mockResolvedValue([
        new EntityLineItem(
          "1",
          2002,
          "name",
          "title",
          "price",
          "vendor",
          1,
          null,
          null,
        ),
      ]),
    } as any;
  }
  if (entity === ShopifyProduct) {
    return {
      ...mockProductRepository,
      find: jest.fn().mockResolvedValue([
        new ShopifyProduct(
          "1",
          1001,
          "name",
          "title",
          "body_html",
          "vendor",
          "product_type",
          new Date(),
          new Date(),
          "status",
        ),
      ]),
    } as any;
  }
  throw new Error("Unknown entity");
});


(AppDataSource.transaction as jest.Mock).mockImplementation(async (cb) => {
  return cb(mockEntityManager);
});

describe("OrderRepository", () => {
  let orderRepository: OrderRepository;

  beforeEach(() => {
    orderRepository = new OrderRepository();
    jest.clearAllMocks();
  
    // Mock setupMaps para evitar chamadas reais ao banco
    jest.spyOn(orderRepository, "setupMaps").mockImplementation(async () => {
      orderRepository["existingOrdersMap"] = new Map([
        ["1001", new ShopifyOrder("1", 1001)],
      ]);
      orderRepository["existingLineItemsMap"] = new Map([
        ["2002", new EntityLineItem("1", 2002, "name", "title", "price", "vendor", 1, null, null)],
      ]);
      orderRepository["existingProductsMap"] = new Map([
        ["1001", new ShopifyProduct("1", 1001, "name", "title", "body_html", "vendor", "product_type", new Date(), new Date(), "status")],
      ]);
    });
  });

  describe("storeOrders", () => {
    it("should save new orders and line items", async () => {
      const orders: Order[] = [
        new Order(
          "1",
          "1001",
          [],
          "graphqlApiId",
          true,
          "confirmation",
          true,
          new Date(),
          "USD",
          "10",
          "15",
          "5",
          "en",
          "paid",
          "Order1",
          1,
          "USD",
          new Date(),
          "shopify",
          "10",
          "",
          false,
          "0",
          "10",
          "15",
          "5",
          12345,
          new Date(),
          123,
          "token",
        ),
      ];
  
      await orderRepository.storeOrders(orders);
  
      expect(mockEntityManager.save).toHaveBeenCalledWith(expect.any(Array));
      expect(mockEntityManager.save).toHaveBeenCalledTimes(1); 
    });

    it("should update existing orders", async () => {
      // Mock existing orders in the database
      mockOrderRepository.find.mockResolvedValue([new ShopifyOrder("1", 1001)]);
      const orders: Order[] = [
        new Order(
          "1",
          "1001",
          [],
          "graphqlApiId",
          true,
          "confirmation",
          true,
          new Date(),
          "USD",
          "10",
          "15",
          "5",
          "en",
          "paid",
          "Order1",
          1,
          "USD",
          new Date(),
          "shopify",
          "10",
          "",
          false,
          "0",
          "10",
          "15",
          "5",
          12345,
          new Date(),
          123,
          "token",
        ),
      ];

      await orderRepository.setupMaps(orders);
      await orderRepository.storeOrders(orders);

      expect(mockEntityManager.update).toHaveBeenCalled();
    });

    // it('should log a warning when a line item has no linked product', async () => {
    //   // Criação de um pedido de teste que tem um line item sem produto vinculado
    //   const line_item: EntityLineItem = new EntityLineItem(
    //     uuidv4(), // id
    //     2002, // platform_id
    //     'Mock Line Item', // name
    //     'Mock Line Item Title', // title
    //     '100.00', // price
    //     'Mock Vendor', // vendor
    //     1, // quantity
    //     null, // product_id
    //     null // orderId
    //   );

    //   const order = new Order(
    //     uuidv4(), // id
    //     '1001', // platform_id
    //     [line_item], // line_items
    //     '', // adminGraphqlApiId
    //     false, // buyerAcceptsMarketing
    //     '', // confirmationNumber
    //     false, // confirmed
    //     new Date(), // createdAt
    //     'USD', // currency
    //     '0', // currentSubtotalPrice
    //     '0', // currentTotalPrice
    //     '0', // currentTotalTax
    //     '', // customerLocale
    //     '', // financialStatus
    //     '', // name
    //     0, // orderNumber
    //     'USD', // presentmentCurrency
    //     new Date(), // processedAt
    //     '', // sourceName
    //     '0', // subtotalPrice
    //     '', // tags
    //     false, // taxExempt
    //     '0', // totalDiscounts
    //     '0', // totalLineItemsPrice
    //     '0', // totalPrice
    //     '0', // totalTax
    //     null, // userId
    //     null, // updatedAt
    //     0, // checkoutId
    //     null // checkoutToken
    //   );

    //   const orders: Order[] = [order];
      
    
    //   // Criar um spy no logger.warn
    //   const loggerSpy = jest.spyOn(logger, 'warn').mockReturnValue(logger);
    
    //   // Mock da função setupMaps, pois ela é assíncrona e interage com o banco
    //   jest.spyOn(OrderRepository.prototype, 'setupMaps').mockResolvedValue(undefined);
    
    //   // Chamar o método a ser testado
    //   const orderRepository = new OrderRepository();
    //   await orderRepository.storeOrders(orders);
    
    //   // Verificar se o método de log foi chamado corretamente
    //   expect(loggerSpy).toHaveBeenCalledWith(
    //     'Skipping line item 2002 as it has no linked product.',
    //     { lineItem: expect.objectContaining({ platformId: '2002' }) },
    //   );
    
    //   // Restaurar o método original do logger
    //   loggerSpy.mockRestore();
    // });
    
  });
});
