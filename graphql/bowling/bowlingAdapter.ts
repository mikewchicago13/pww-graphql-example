import {Game} from './bowlingGame';
import {ScoreSheet} from "./scoreSheet";
import {IGame} from "./bowlingUtilities";

interface IGraphQLAdaptedGame {
  rollPins({pins}: { pins: number }): IGraphQLAdaptedGame;

  get score(): number;

  get scoreSheet(): ScoreSheet;
}

class GraphQLAdaptedGame implements IGraphQLAdaptedGame {
  private readonly _game: IGame;

  constructor(game: IGame) {
    this._game = game;
  }

  rollPins({pins}: { pins: number }): IGraphQLAdaptedGame {
    return new GraphQLAdaptedGame(this._game.roll(pins));
  }

  get score(): number {
    return this._game.score;
  }

  get scoreSheet(): ScoreSheet {
    return this._game.scoreSheet;
  }
}

export class BowlingAdapter {
  static acceptAllRollsAtOnce(_: unknown, {rolls}: { rolls: number[] }): IGraphQLAdaptedGame {
    console.log("rolls " + rolls);
    const game = new Game();
    rolls.forEach(value => game.roll(value));
    return new GraphQLAdaptedGame(game);
  }

  static enableInteractive(): IGraphQLAdaptedGame {
    return new GraphQLAdaptedGame(new Game());
  }
}