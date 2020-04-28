const assert = require("chai").assert;

describe("Basic mocha string test", () => {
  it("should return the number of characters in a string", () => {
    assert.equal("Hello".length, 5);
    assert.typeOf("Multiple asserts allowed?", "string");
  });

  it("should return the first character of a String", () => {
    assert.equal("Hello".charAt(0), "H");
  });
});
