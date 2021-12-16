export class Money {
  _cents: number;

  constructor(dollars: number, cents: number) {
    this._cents = dollars * 100 + cents;
  }

  add(money: Money): Money {
    return new Money(0, this._cents + money._cents);
  }
}

export class LineItem {
  static create(
    asOf: string,
    dollars: number,
    cents: number): LineItem{
    return new LineItem(
      new Date(Date.parse(asOf)),
      new Money(dollars, cents));
  }

  private readonly _asOf: Date;
  private readonly _amount: Money;

  constructor(asOf: Date, amount: Money) {
    this._asOf = asOf;
    this._amount = amount;
  }


  get asOf(): Date {
    return this._asOf;
  }

  get amount(): Money {
    return this._amount;
  }
}

export class Invoice {
  _lineItems: LineItem[]

  constructor(lineItems: LineItem[]) {
    this._lineItems = lineItems;
  }

  get total(): Money{
    return this._lineItems
      .map(x => x.amount)
      .reduce(
        (a, b) => a.add(b),
        new Money(0, 0));
  }
}