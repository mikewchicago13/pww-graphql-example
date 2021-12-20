import bowlingGame, {Game} from "../../graphql/bowling/bowlingGame";

describe('bowlingGame', () => {
  it('should have a score of zero', () => {
    expect(bowlingGame().score).toBe(0);
  });
  it('should enable rolls', () => {
    expect(bowlingGame()
      .roll(0)
      .score).toBe(0);
  });
  it('should roll a 1', () => {
    expect(bowlingGame()
      .roll(1)
      .score).toBe(1);
  });
  it('should roll 20 straight 1s', () => {
    const game: Game = new Array(20).fill(1)
      .reduce((g: Game) => g.roll(1), bowlingGame())
    expect(game.score).toBe(20);
    for (let i = 0; i < 10; i++) {
      expect(game.scoreUpToFrame(i)).toBe((i + 1) * 2);
    }
  });
  it('should roll 21 straight 5s', () => {
    const game = new Array(21).fill(1)
      .reduce((g: Game) => g.roll(5), bowlingGame());
    expect(game.score).toBe(150);

    for (let i = 0; i < 10; i++) {
      expect(game.scoreUpToFrame(i)).toBe((i + 1) * 15);
    }
  });
  it('should pick up a spare', () => {
    const game = new Array(3).fill(1)
      .reduce((g: Game) => g.roll(5), bowlingGame());
    expect(game.score).toBe(20);
  });
  it('should pick up a strike', () => {
    const game = new Array(2).fill(1)
      .reduce((g: Game) => g.roll(10), bowlingGame());
    expect(game.score).toBe(30);
  });
  it('should roll a perfect game', () => {
    let game =new Array(12).fill(1)
      .reduce((g: Game) => g.roll(10), bowlingGame());

    expect(game.score).toBe(300);

    for (let i = 0; i < 10; i++) {
      expect(game.scoreUpToFrame(i)).toBe((i + 1) * 30);
    }
  });
  it('should roll a 299', () => {
    const game = new Array(11).fill(1)
      .reduce((g: Game) => g.roll(10), bowlingGame())
      .roll(9);
    expect(game.score).toBe(299);
  });
  it('should gutter until 10th frame, then strike out', () => {
    const game = new Array(18).fill(1)
      .reduce((g: Game) => g.roll(0), bowlingGame());
    for (let i = 0; i < 18; i++) {
      expect(game.scoreUpToFrame(Math.trunc(i / 2))).toBe(0);
    }
    expect(game
      .roll(10)
      .roll(10)
      .roll(10)
      .score).toBe(30);
  });
  it('should gutter, spare, strike, one to prove that only first ball 10s are counted as strike', () => {
    const game = bowlingGame()
      .roll(0)
      .roll(10)
      .roll(10)
      .roll(1)
    ;
    expect(game.score).toBe(32);
  });
});