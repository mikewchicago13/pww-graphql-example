import add from "../../graphql/codewars/chainAdd";
import {assert} from "chai";
import "../jest.d"

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

  it('10 > 2', () => {
    expect(add(10)).toBeGreaterThanAny(add(2));
  });
  it('2 > 1', () => {
    expect(add(2)).toBeGreaterThanAny(add(1));
  });
  it('2 < 10', () => {
    expect(add(2)).toBeLessThanAny(add(10));
  });
  it('10 < 2', () => {
    expect(add(10)).not.toBeLessThanAny(add(2));
  });
  it('2 > 10', () => {
    expect(add(2)).not.toBeGreaterThanAny(add(10));
  });

  it('1 <= 2', () => {
    expect(add(1)).toBeLessThanOrEqualAny(add(2));
  });
  it('1 <= 1', () => {
    expect(add(1)).toBeLessThanOrEqualAny(add(1));
  });
  it('2 <= 1', () => {
    expect(add(2)).not.toBeLessThanOrEqualAny(add(1));
  });

  it('2 >= 1', () => {
    expect(add(2)).toBeGreaterThanOrEqualAny(add(1));
  });
  it('1 >= 1', () => {
    expect(add(1)).toBeGreaterThanOrEqualAny(add(1));
  });
  it('1 >= 2', () => {
    expect(add(1)).not.toBeGreaterThanOrEqualAny(add(2));
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