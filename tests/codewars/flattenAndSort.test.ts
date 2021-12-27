import {expect} from "chai";
import {flattenAndSort} from "../../graphql/codewars/flattenAndSort";

describe("flattenAndSort()", function() {
  it("should pass sample tests", function() {
    expect(flattenAndSort([])).to.deep.equal([]);
  });
  it('1', () => {
    expect(flattenAndSort([[], []])).to.deep.equal([]);
  });
  it('2', () => {
    expect(flattenAndSort([[], [1]])).to.deep.equal([1]);
  });
  it('3', () => {
    expect(flattenAndSort([[3, 2, 1], [7, 9, 8], [6, 4, 5]])).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
  it('4', () => {
    expect(flattenAndSort([[1, 3, 5], [100], [2, 4, 6]])).to.deep.equal([1, 2, 3, 4, 5, 6, 100]);
  });
});