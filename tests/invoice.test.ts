import chai from "chai";

const {assert} = chai;
chai.config.truncateThreshold = 0;

import {Invoice, LineItem, Money} from "../invoice";

describe('Invoice', () => {
  const actual = new Invoice(
    [
      LineItem.create("2021-01-01", new Money(1, 99), 1),
      LineItem.create("2021-02-02", new Money(2, 2), 1),
    ]
  );
  it('should have a total', () => {
    assert.deepEqual(actual.total, new Money(4, 1));
  });

  describe('should get items sorted newest to oldest', () => {
    const dates: Date[] = actual.lineItems
      .map(x => x.asOf);
    it('Feb 2 is first', () => {
      assert.deepEqual(dates[0], new Date(Date.parse("2021-02-02")));
    });
    it('Jan 1 is first', () => {
      assert.deepEqual(dates[1], new Date(Date.parse("2021-01-01")));
    });
  });

  describe('multiple items', () => {
    const actual = new Invoice(
      [
        LineItem.create("2021-01-01", new Money(1, 0), 7),
        LineItem.create("2021-02-02", new Money(2, 0), 1),
      ]
    );
    it('should have a total', () => {
      assert.deepEqual(actual.total, new Money(9, 0));
    });
  });
});

describe('Money', () => {
  describe('display', () => {
    it('zero', () => {
      assert.deepEqual(new Money(0, 0) + "",
        "0.00");
    });
    it('1000.01', () => {
      assert.deepEqual(new Money(1_000, 1) + "",
        "1,000.01");
    });
    it('123456789.99', () => {
      assert.deepEqual(new Money(123_456_789, 99) + "",
        "123,456,789.99");
    });
  });

  describe('multiply', () => {
    it('zero', () => {
      assert.deepEqual(new Money(0, 0).multiplyBy(2),
        new Money(0, 0));
    });
    it('1x2', () => {
      assert.deepEqual(new Money(0, 1).multiplyBy(2),
        new Money(0, 2));
    });
  });
});
