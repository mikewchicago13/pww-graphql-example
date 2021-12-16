class Money {
  _dollars: number;
  _cents: number;
}

class LineItem {
  _asOf: Date;
  _amount: Money;
}

class Invoice {
  _lineItems: LineItem[]
}

export default Invoice;