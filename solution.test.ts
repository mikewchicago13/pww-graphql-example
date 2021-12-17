import chai from "chai";
import sayHello from "./solution";

const {assert} = chai;
chai.config.truncateThreshold = 0;

describe("sayHello", () => {
  it("should say hello", () => {
    assert.strictEqual(sayHello("Qualified"), "Hello, Qualified!");
  });

  it("should say hello with no arguments", () => {
    assert.strictEqual(sayHello(), "Hello there!");
  });

  it("should say hello with blank", () => {
    assert.strictEqual(sayHello(""), "Hello there!");
  });

  it("should say hello with undefined", () => {
    assert.strictEqual(sayHello(undefined), "Hello there!");
  });
});