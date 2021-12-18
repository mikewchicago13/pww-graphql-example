import {Game} from './bowling';

export class BowlingAdapter {
  create() {
    return (
      _: unknown,
      {rolls}: { rolls: number[] }
    ): Game => {
      console.log("rolls " + rolls);
      const game = new Game();
      rolls.forEach(value => game.roll(value));
      return game;
    };
  }
}