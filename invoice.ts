export class Money {
  _cents: number;

  private static readonly CENTS_PER_DOLLAR = 100;

  constructor(dollars: number, cents: number) {
    this._cents = dollars * Money.CENTS_PER_DOLLAR + cents;
  }

  add(money: Money): Money {
    return new Money(0, this._cents + money._cents);
  }

  toString(): string {
    const wholeDollars = Math.trunc(this._cents / Money.CENTS_PER_DOLLAR);
    const remainingCents = this._cents % Money.CENTS_PER_DOLLAR;
    return wholeDollars.toLocaleString() + "." + String(remainingCents).padStart(2, "0");
  }
}

export class LineItem {
  static create(
    asOf: string,
    dollars: number,
    cents: number): LineItem {
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

  get asOfTime(): number {
    return this.asOf.getTime();
  }

  get asOf(): Date {
    return this._asOf;
  }

  get amount(): Money {
    return this._amount;
  }
}

export class Invoice {
  private readonly _lineItems: LineItem[]

  constructor(lineItems: LineItem[]) {
    this._lineItems = lineItems;
  }

  get lineItems(): LineItem[] {
    const newestToOldest = (a: LineItem, b: LineItem) => {
      return b.asOfTime - a.asOfTime;
    };
    return this._lineItems
      .sort(newestToOldest);
  }

  get total(): Money {
    return this._lineItems
      .map(x => x.amount)
      .reduce(
        (a, b) => a.add(b),
        new Money(0, 0));
  }
}