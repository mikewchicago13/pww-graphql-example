import {Game} from "./bowling";

class Frame {
  private readonly _rolls: number[];
  private readonly _frameIndex: number;

  constructor(rolls: number[], frameIndex: number) {
    this._rolls = rolls;
    this._frameIndex = frameIndex;
  }

  get _allowedNumberOfBallsThrown(): number {
    return 2;
  }

  get ballsThrown(): (string | undefined)[] {
    const start = this._frameIndex * 2;
    return this._rolls
      .slice(start, start + this._allowedNumberOfBallsThrown)
      .map((value, index, array) =>
        this._stringRepresentation(value, index, array));
  }

  private _stringRepresentation(value: number, index: number, array: number[]): string | undefined {
    if (value !== undefined) {
      if (this._isStrike(index, value)) {
        return "X";
      }
      if (this._isSpare(index, array)) {
        return "/";
      }
      if (value === 0) {
        return "-";
      }
      return String(value)
    }
    return undefined;
  }

  protected _isStrike(index: number, value: number) {
    return index === 0 && value === 10;
  }

  protected _isSpare(indexWithinFrame: number, ballsThrown: number[]) {
    return indexWithinFrame === 1 &&
      Frame._sumsToTen(ballsThrown);
  }

  private static _sumsToTen(ballsThrown: number[]) {
    return ballsThrown.reduce((a, b) => a + b) === 10;
  }

  get runningScore(): number | undefined {
    if (this._isStrikeFilledIn()) {
      return this._scoreUpToThisFrame() + this._next(2);
    }
    if (this._isSpareFilledIn()) {
      return this._scoreUpToThisFrame() + this._next(1);
    }
    if (this._isOpenFrame()) {
      return this._scoreUpToThisFrame();
    }
    return undefined;
  }

  private _isOpenFrame(): boolean {
    const startRoll = this._frameIndex * 2;
    const ballsThrown = this._rolls
      .slice(startRoll, startRoll + 2)
      .filter(value => value !== undefined);

    const pinsKnockedDown = ballsThrown.reduce((a, b) => a + b, 0);

    return ballsThrown.length === 2 && pinsKnockedDown < 10;
  }

  private _isSpareFilledIn(): boolean {
    const startRoll = this._frameIndex * 2;
    const ballsThrown = this._rolls
      .slice(startRoll, startRoll + 2)
      .filter(value => value !== undefined);
    if (ballsThrown.length < 2) {
      return false;
    }
    return Frame._sumsToTen(ballsThrown) &&
      this._rolls[startRoll + 2] !== undefined;
  }

  private _isStrikeFilledIn(): boolean {
    const startRoll = this._frameIndex * 2;
    const ballsThrown = this._rolls
      .slice(startRoll, startRoll + 1)
      .filter(value => value !== undefined);
    if (ballsThrown.length < 1) {
      return false;
    }

    const hasTwoBallsAfterThis =
      this._rolls
        .slice(startRoll + 2)
        .filter(value => value !== undefined)
        .length >= 2;

    return Frame._sumsToTen(ballsThrown) && hasTwoBallsAfterThis;
  }

  private _next(forwardLookingRolls: number): number {
    return this._rolls.slice((this._frameIndex * 2) + 2)
      .filter(value => value !== undefined)
      .slice(0, forwardLookingRolls + 1)
      .reduce((a, b) => a + b, 0);
  }

  private _scoreUpToThisFrame(): number {
    const game = new Game();
    this._rolls.slice(0, (this._frameIndex * 2) + 2)
      .filter(value => value !== undefined)
      .forEach(pins => game.roll(pins));
    return game.score;
  }
}

class TenthFrame extends Frame {
  constructor(_rolls: number[]) {
    super(_rolls, 9);
  }

  get _allowedNumberOfBallsThrown(): number {
    return 3;
  }

  protected _isStrike(_: number, value: number): boolean {
    return value === 10;
  }

  protected _isSpare(indexWithinFrame: number, ballsThrown: number[]): boolean {
    const areBallsStartingAtIndexASpare = (start: number) => ballsThrown
      .slice(start, start + 2)
      .reduce((a, b) => a + b) === 10;

    const areFirstTwoBallsASpare = areBallsStartingAtIndexASpare(0);
    if (indexWithinFrame === 1) {
      return areFirstTwoBallsASpare;
    }

    if (!areFirstTwoBallsASpare && indexWithinFrame === 2) {
      return areBallsStartingAtIndexASpare(1);
    }
    return false;
  }
}

export class ScoreSheet {
  private readonly _rolls: number[];

  constructor(rolls: number[]) {
    this._rolls = rolls;
  }

  get frames(): Frame[] {
    return new Array(10).fill(0)
      .map((_, frameIndex) => {
        return frameIndex === 9 ?
          new TenthFrame(this._rolls) :
          new Frame(this._rolls, frameIndex);
      });
  }
}