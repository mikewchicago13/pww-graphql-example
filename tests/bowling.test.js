import bowling from "../graphql/bowling";

describe('bowling', () => {
  const game = bowling();
  it('should have a score of zero', () => {
    expect(game.score).toBe(0);
  });
});