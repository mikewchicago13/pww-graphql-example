// wovenForEncamp.test.js

import {Invoice, LineItem, Money} from "../invoice";

describe('Invoice', () => {
  const actual = new Invoice(
    [
      LineItem.create("2021-01-01", 1, 99),
      LineItem.create("2021-01-02", 2, 2),
    ]
  );
  it('should create an instance', () => {
    expect(actual).toBeTruthy();
  });

  it('should have a total', () => {
    expect(actual.total).toStrictEqual(new Money(4, 1));
  });
});
