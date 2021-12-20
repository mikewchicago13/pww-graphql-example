import {ScoreSheet} from "./scoreSheet";
import {FrameUtilities, IndexedGame} from "./bowlingUtilities";

export interface IGame {
  roll(pins: number): IGame;
  get score(): number;
  get scoreSheet(): ScoreSheet;
}

export class Game implements IndexedGame, IGame {
  private readonly _rolls: number[] = new Array(21).fill(undefined);
  private _index = 0;

  roll(pins: number): IGame {
    this._rolls[this._index] = pins;
    if (Game._isStrike(pins) && this._isFirstBallOf9thFrameOrEarlier()) {
      this._index += 2;
    } else {
      this._index++;
    }
    return this;
  }

  private _countPinsFor(roll: number): number {
    const _pins = (roll: number) => {
      return this._rolls[roll] || 0;
    }
    if (Game._isStrike(_pins(roll))) {
      return _pins(roll) + this._nextTwoRolls(roll);
    } else if (Game._isSpare(_pins(roll), _pins(roll + 1))) {
      return _pins(roll) + this._nextTwoRolls(roll);
    }
    return _pins(roll) + _pins(roll + 1);
  }

  private _getCounts(): number[] {
    return new Array(10).fill(0)
      .map((_, frame) => this._countPinsFor(frame * 2));
  }

  get score(): number {
    return this.scoreUpToFrame(10);
  }

  scoreUpToFrame(frameIndex: number): number {
    return this._getCounts()
      .slice(0, frameIndex + 1)
      .reduce((a, b) => a + b);
  }

  get scoreSheet(): ScoreSheet {
    return new ScoreSheet(this._rolls, this);
  }

  private static _isStrike(firstBallOfFrame: number): boolean {
    return FrameUtilities.wereAllPinsKnockedDown([firstBallOfFrame]);
  }

  private static _isSpare(...rolls: number[]): boolean {
    return FrameUtilities.wereAllPinsKnockedDown(rolls)
  }

  private _isFirstBallOf9thFrameOrEarlier(): boolean {
    return this._index < 18 && this._index % 2 === 0;
  }

  private _nextTwoRolls(index: number): number {
    return this._rolls.slice(index + 1)
      .filter(value => value !== undefined)
      .slice(0, 2)
      .reduce((a, b) => a + b, 0);
  }

  toString(): string {
    return JSON.stringify(this);
  }


}

function bowlingGame() {
  return new Game();
}

export default bowlingGame;