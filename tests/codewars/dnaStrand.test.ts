import {Kata} from "../../graphql/codewars/dnaStrand";
import {assert} from "chai";

describe("dnaStrand", function() {
  it('A => T', () => {
    assert.strictEqual(Kata.dnaStrand("AAAA"),"TTTT","String AAAA is");
  });
  it('all combinations', () => {
    assert.strictEqual(Kata.dnaStrand("ATTGC"),"TAACG","String ATTGC is");
  });
});