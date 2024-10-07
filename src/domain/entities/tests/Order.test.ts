import { v4 as uuidv4 } from "uuid";
import { LineItem } from "../LineItem";
import { Order } from "../Order";

describe("Order", () => {
  it("should create an order with provided values", () => {
    const id = uuidv4();
    const platformId = "1001";
    const lineItems: LineItem[] = [
      new LineItem(
        "1",
        1001,
        "Item 1",
        "Title 1",
        "10.00",
        "Vendor 1",
        2,
        null,
        null,
      ),
    ];
    const order = new Order(
      id,
      platformId,
      lineItems,
      "graphqlApiId",
      true,
      "confirmationNumber",
      true,
      new Date("2024-01-01"),
      "USD",
      "100.00",
      "120.00",
      "20.00",
      "en",
      "paid",
      "Order1",
      1,
      "USD",
      new Date("2024-01-02"),
      "shopify",
      "100.00",
      "tag1",
      false,
      "10.00",
      "110.00",
      "120.00",
      "20.00",
      12345,
      new Date("2024-01-03"),
      123,
      "token",
    );

    expect(order.id).toBe(id);
    expect(order.platformId).toBe(platformId);
    expect(order.lineItems).toEqual(lineItems);
    expect(order.adminGraphqlApiId).toBe("graphqlApiId");
    expect(order.buyerAcceptsMarketing).toBe(true);
    expect(order.confirmationNumber).toBe("confirmationNumber");
    expect(order.confirmed).toBe(true);
    expect(order.createdAt).toEqual(new Date("2024-01-01"));
    expect(order.currency).toBe("USD");
    expect(order.currentSubtotalPrice).toBe("100.00");
    expect(order.currentTotalPrice).toBe("120.00");
    expect(order.currentTotalTax).toBe("20.00");
    expect(order.customerLocale).toBe("en");
    expect(order.financialStatus).toBe("paid");
    expect(order.name).toBe("Order1");
    expect(order.orderNumber).toBe(1);
    expect(order.presentmentCurrency).toBe("USD");
    expect(order.processedAt).toEqual(new Date("2024-01-02"));
    expect(order.sourceName).toBe("shopify");
    expect(order.subtotalPrice).toBe("100.00");
    expect(order.tags).toBe("tag1");
    expect(order.taxExempt).toBe(false);
    expect(order.totalDiscounts).toBe("10.00");
    expect(order.totalLineItemsPrice).toBe("110.00");
    expect(order.totalPrice).toBe("120.00");
    expect(order.totalTax).toBe("20.00");
    expect(order.userId).toBe(12345);
    expect(order.updatedAt).toEqual(new Date("2024-01-03"));
    expect(order.checkoutId).toBe(123);
    expect(order.checkoutToken).toBe("token");
  });

  it("should create an order with default values", () => {
    const platformId = "1001";
    const order = new Order(uuidv4(), platformId);

    expect(order.id).toBeDefined();
    expect(order.platformId).toBe(platformId);
    expect(order.lineItems).toBeUndefined();
    expect(order.adminGraphqlApiId).toBeUndefined();
    expect(order.buyerAcceptsMarketing).toBeUndefined();
    expect(order.confirmationNumber).toBeUndefined();
    expect(order.confirmed).toBeUndefined();
    expect(order.createdAt).toBeUndefined();
    expect(order.currency).toBeUndefined();
    expect(order.currentSubtotalPrice).toBeUndefined();
    expect(order.currentTotalPrice).toBeUndefined();
    expect(order.currentTotalTax).toBeUndefined();
    expect(order.customerLocale).toBeUndefined();
    expect(order.financialStatus).toBeUndefined();
    expect(order.name).toBeUndefined();
    expect(order.orderNumber).toBeUndefined();
    expect(order.presentmentCurrency).toBeUndefined();
    expect(order.processedAt).toBeUndefined();
    expect(order.sourceName).toBeUndefined();
    expect(order.subtotalPrice).toBeUndefined();
    expect(order.tags).toBeUndefined();
    expect(order.taxExempt).toBeUndefined();
    expect(order.totalDiscounts).toBeUndefined();
    expect(order.totalLineItemsPrice).toBeUndefined();
    expect(order.totalPrice).toBeUndefined();
    expect(order.totalTax).toBeUndefined();
    expect(order.userId).toBeUndefined();
    expect(order.updatedAt).toBeUndefined();
    expect(order.checkoutId).toBeUndefined();
    expect(order.checkoutToken).toBeUndefined();
  });
});
