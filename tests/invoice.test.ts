// wovenForEncamp.test.js

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
      expect(dates[0]).toBe(new Date(Date.parse("2021-02-02")));
    });
    it('Jan 1 is first', () => {
      expect(dates[1]).toBe(new Date(Date.parse("2021-01-01")));
    });
  });
});
