import {validBraces} from "../../graphql/codewars/validBraces";
import { assert } from "chai";

describe("valid braces", function() {
  it("parentheses", function() {
    assert.strictEqual(validBraces("()"), true);
  });
  it("square brackets", function() {
    assert.strictEqual(validBraces("[]"), true);
  });
  it("curly braces", function() {
    assert.strictEqual(validBraces("{}"), true);
  });
  it('mismatch', () => {
    assert.strictEqual(validBraces("[(])"), false);
  });
  it('mismatch missing opening }', () => {
    assert.strictEqual(validBraces("[]()}"), false);
  });
  it('mismatch missing opening [', () => {
    assert.strictEqual(validBraces("]"), false);
  });
  it('mismatch missing opening (', () => {
    assert.strictEqual(validBraces(")"), false);
  });
  it('mismatch missing closing }', () => {
    assert.strictEqual(validBraces("{"), false);
  });
  it('mismatch missing closing )', () => {
    assert.strictEqual(validBraces("("), false);
  });
  it('mismatch missing closing ]', () => {
    assert.strictEqual(validBraces("["), false);
  });
  it('intermixed different types', () => {
    assert.strictEqual(validBraces("[[]]({}){[]}{[()]}{[({})]}(((((([]))))))"), true);
  });
});