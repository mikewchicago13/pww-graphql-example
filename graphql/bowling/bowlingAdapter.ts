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
  private readonly _rolls: number[];

  constructor(game: IGame) {
    this._game = game;
    this._rolls = [];
  }

  rollPins({pins}: { pins: number }): IGraphQLAdaptedGame {
    this._rolls.push(pins);
    const game = this._rolls.reduce((previousValue, currentValue) => {
      return previousValue.roll(currentValue) as Game;
    }, new Game());
    console.log("rolls", this._rolls, "score", game.score);
    return new GraphQLAdaptedGame(game);
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
    const game = rolls.reduce((previousValue, currentValue) => {
      return previousValue.roll(currentValue) as Game;
    }, new Game());
    console.log("rolls", rolls, "score", game.score);
    return new GraphQLAdaptedGame(game);
  }

  static enableInteractive(): IGraphQLAdaptedGame {
    return new GraphQLAdaptedGame(new Game());
  }
}