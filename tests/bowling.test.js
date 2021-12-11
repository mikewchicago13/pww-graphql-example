import bowling from "../graphql/bowling";

describe('bowling', () => {
  it('should have a score of zero', () => {
    expect(bowling().score).toBe(0);
  });
  it('should enable rolls', () => {
    expect(bowling()
      .roll(0)
      .score).toBe(0);
  });
  it('should roll a 1', () => {
    expect(bowling()
      .roll(1)
      .score).toBe(1);
  });
});