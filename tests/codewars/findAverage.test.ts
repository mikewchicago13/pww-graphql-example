import {findAverage} from "../../graphql/codewars/findAverage";
import {assert} from "chai";

describe("solution", () => {
  it('should calculate avg of given numbers',() => {
    assert.strictEqual(findAverage([1,1,1]), 1);
  });
  it('should calculate avg of given numbers',() => {
    assert.strictEqual(findAverage([4,5,6]), 5);
  });
  it('zero length',() => {
    assert.strictEqual(findAverage([]), 0);
  });
});

