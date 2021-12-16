// wovenForEncamp.test.js

import Invoice from "../invoice";

describe('Invoice', () => {
  const actual = new Invoice();
  it('should create an instance', () => {
    expect(actual).toBeTruthy();
  });
});
