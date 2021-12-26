import add from "../../graphql/codewars/chainAdd";
import {assert} from "chai";

describe('solution', () => {
  it('should work when called once', () => {
    assert.equal(add(1), 1);
  });
  it('should work when called twice', () => {
    assert.equal(add(1)(2), 3);
  });
  it('should work when called three times', () => {
    assert.equal(add(1)(2)(5), 8);
  });
  it('should work when called 5 times', () => {
    assert.equal(add(1)(2)(3)(4)(5), 15);
  });

  describe('should keep function', () => {
    const addTwo = add(2);
    it('be 2', () => {
      assert.equal(addTwo, 2);
    });
    it('allow plus operator', () => {
      assert.equal(addTwo + 5, 7);
    });
    it('calling once', () => {
      assert.equal(addTwo(3), 5);
    });
    it('calling twice', () => {
      assert.equal(addTwo(3)(5), 10);
    });
  });
});