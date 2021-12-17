import {getProductsOfAllIntsExceptAtIndex} from "../getProductsOfAllIntsExceptAtIndex";

describe('max profit', () => {
  it('example case', () => {
    expect(getProductsOfAllIntsExceptAtIndex([1, 7, 3, 4])).toStrictEqual([84, 12, 28, 21]);
  });
  it('simple case', () => {
    expect(getProductsOfAllIntsExceptAtIndex([1, 2])).toStrictEqual([2, 1]);
  });
  it('simple case', () => {
    expect(getProductsOfAllIntsExceptAtIndex([0, 1, 2])).toStrictEqual([2, 0, 0]);
  });
  it('slightly more exotic simple case', () => {
    expect(getProductsOfAllIntsExceptAtIndex([1, 2, 3])).toStrictEqual([6, 3, 2]);
  });
});