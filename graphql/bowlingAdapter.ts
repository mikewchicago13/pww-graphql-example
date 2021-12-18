import bowling from './bowling';

export class BowlingAdapter {
  create() {
    return (
      _: unknown,
      {rolls}: { rolls: number[] }
    ): any => {
      console.log("rolls " + rolls);
      const game = bowling();
      rolls.forEach(value => game.roll(value))
      return game;
    };
  }
}