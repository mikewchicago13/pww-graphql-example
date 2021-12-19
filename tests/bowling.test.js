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
  it('should roll 21 straight 5s', () => {
    let game = bowling();
    for (let i = 0; i < 21; i++) {
      game = game.roll(5);
    }
    expect(game.score).toBe(150);
  });
  it('should pick up a spare', () => {
    let game = bowling();
    for (let i = 0; i < 3; i++) {
      game = game.roll(5);
    }
    expect(game.score).toBe(20);
  });
  it('should pick up a strike', () => {
    let game = bowling();
    for (let i = 0; i < 2; i++) {
      game = game.roll(10);
    }
    expect(game.score).toBe(30);
  });
  it('should roll a perfect game', () => {
    let game = bowling();
    for (let i = 0; i < 12; i++) {
      game = game.roll(10);
    }
    expect(game.score).toBe(300);

    for (let i = 0; i < 10; i++) {
      expect(game.scoreUpToFrame(i)).toBe((i + 1) * 30);
    }
  });
  it('should roll a 299', () => {
    let game = bowling();
    for (let i = 0; i < 11; i++) {
      game = game.roll(10);
    }
    game = game.roll(9);
    expect(game.score).toBe(299);
  });
  it('should gutter until 10th frame, then strike out', () => {
    let game = bowling();
    for (let i = 0; i < 18; i++) {
      game = game.roll(0);
    }
    for (let i = 0; i < 3; i++) {
      game = game.roll(10);
    }
    expect(game.score).toBe(30);
  });
  it('should gutter, spare, strike, one to prove that only first ball 10s are counted as strike', () => {
    const game = bowling()
      .roll(0)
      .roll(10)
      .roll(10)
      .roll(1)
    ;
    expect(game.score).toBe(32);
  });
});