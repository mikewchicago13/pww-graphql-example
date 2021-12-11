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
  it('should roll 20 straight 1s', () => {
    let game = bowling();
    for (let i = 0; i < 20; i++) {
      game = game.roll(1);
    }
    expect(game.score).toBe(20);
  });
});