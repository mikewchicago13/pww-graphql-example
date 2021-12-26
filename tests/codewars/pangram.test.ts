import {isPangram} from "../../graphql/codewars/pangram";

import { assert } from "chai";

describe("example", function() {
  it("true", function() {
    assert.strictEqual(isPangram("The quick brown fox jumps over the lazy dog."), true);
  });
  it('false', () => {
    assert.strictEqual(isPangram("This is not a pangram."), false);
  });
});