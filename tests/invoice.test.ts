// invoice.test.ts

import {Invoice, LineItem, Money} from "../invoice";

describe('Invoice', () => {
  const actual = new Invoice(
    [
      LineItem.create("2021-01-01", 1, 99),
      LineItem.create("2021-02-02", 2, 2),
    ]
  );
  it('should create an instance', () => {
    expect(actual).toBeTruthy();
  });

  it('should have a total', () => {
    expect(actual.total).toStrictEqual(new Money(4, 1));
  });

  describe('should get items sorted newest to oldest', () => {
    const dates: Date[] = actual.lineItems
      .map(x => x.asOf);
    it('Feb 2 is first', () => {
      expect(dates[0]).toStrictEqual(new Date(Date.parse("2021-02-02")));
    });
    it('Jan 1 is first', () => {
      expect(dates[1]).toStrictEqual(new Date(Date.parse("2021-01-01")));
    });
  });
});

describe('Money', () => {
  describe('display', () => {
    it('zero', () => {
      expect(new Money(0, 0).toString())
        .toBe("0.00");
    });
    it('1000.01', () => {
      expect(new Money(1_000, 1).toString())
        .toBe("1,000.01");
    });
    it('123456789.99', () => {
      expect(new Money(123_456_789, 99).toString())
        .toBe("123,456,789.99");
    });
  });

  describe('multiply', () => {
    it('zero', () => {
      expect(new Money(0, 0).multiplyBy(2))
        .toStrictEqual(new Money(0, 0));
    });
    it('1x2', () => {
      expect(new Money(0, 1).multiplyBy(2))
        .toStrictEqual(new Money(0, 2));
    });
  });
});
