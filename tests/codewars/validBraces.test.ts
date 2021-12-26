import { assert } from "chai";
import {validBraces} from "../../graphql/codewars/validBraces";

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
  xit('mismatch', () => {
    assert.strictEqual(validBraces("[(])"), false);
  });
  xit('mismatch missing opening }', () => {
    assert.strictEqual(validBraces("[]()}"), false);
  });
  xit('mismatch missing closing }', () => {
    assert.strictEqual(validBraces("[](){"), false);
  });
  xit('intermixed different types', () => {
    assert.strictEqual(validBraces("[[]]({}){[]}{[()]}{[({})]}"), true);
  });
});