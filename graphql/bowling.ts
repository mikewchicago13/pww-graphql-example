import {ScoreSheet} from "./scoreSheet";

export class Game {
  _rolls: number[] = new Array(21).fill(undefined);
  _index = 0;

  roll(pins: number): Game {
    this._rolls[this._index] = pins;
    if (this._isStrike(pins) && this._isFirstBallOf9thFrameOrEarlier()) {
      this._index += 2;
    } else {
      this._index++;
    }
    return this;
  }

  _countPinsFor(roll: number): number {
    const _pins = (roll: number) => {
      return this._rolls[roll] || 0;
    }
    if (this._isStrike(_pins(roll))) {
      return _pins(roll) + this._nextTwoRolls(roll);
    } else if (this._isSpare(_pins(roll), _pins(roll + 1))) {
      return _pins(roll) + this._nextTwoRolls(roll);
    }
    return _pins(roll) + _pins(roll + 1);
  }

  get score(): number {
    return new Array(10).fill(0)
      .map((_, frame) => this._countPinsFor(frame * 2))
      .reduce((a, b) => a + b, 0);
  }

  get scoreSheet(): ScoreSheet {
    return new ScoreSheet(this._rolls)
  }

  _isStrike(firstBallOfFrame: number): boolean {
    return this._didAllThePinsFall(firstBallOfFrame);
  }

  _isSpare(...rolls: number[]): boolean {
    return this._didAllThePinsFall(...rolls);
  }

  _didAllThePinsFall(...rolls: number[]): boolean {
    return rolls.reduce((a, b) => a + b, 0) === 10;
  }

  _isFirstBallOf9thFrameOrEarlier(): boolean {
    return this._index < 18 && this._index % 2 === 0;
  }

  _nextTwoRolls(index: number): number {
    return this._rolls.slice(index + 1)
      .filter(value => value !== undefined)
      .slice(0, 2)
      .reduce((a, b) => a + b, 0);
  }

  toString(): string {
    return JSON.stringify(this);
  }
}

function bowling() {
  return new Game();
}

export default bowling;