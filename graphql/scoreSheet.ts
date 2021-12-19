import {Game} from "./bowling";

class Frame {
  protected readonly _rolls: number[];
  private readonly _frameIndex: number;

  constructor(rolls: number[], frameIndex: number) {
    this._rolls = rolls;
    this._frameIndex = frameIndex;
  }

  get ballsThrown(): (string | undefined)[] {
    const start = this._frameIndex * 2;
    return this._rolls
      .slice(start, start + this._allowedNumberOfBallsThrown)
      .map((value, index, array) =>
        this._stringRepresentation(value, index, array));
  }

  protected get _allowedNumberOfBallsThrown(): number {
    return 2;
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

  protected _isStrike(indexWithinFrame: number, value: number) {
    return indexWithinFrame === 0 && Frame._sumsToTen([value]);
  }

  protected _isSpare(indexWithinFrame: number, ballsThrown: number[]) {
    return indexWithinFrame === 1 && Frame._sumsToTen(ballsThrown);
  }

  protected static _sumsToTen(ballsThrown: number[]) {
    return ballsThrown.reduce((a, b) => a + b) === 10;
  }

  get runningScore(): number | undefined {
    if (this._isOpenFrame || this._isStrikeFilledIn || this._isSpareFilledIn) {
      return this._scoreUpToThisFrame;
    }
    return undefined;
  }

  private get _isOpenFrame(): boolean {
    const startRoll = this._frameIndex * 2;
    const ballsThrown = this._rolls
      .slice(startRoll, startRoll + 2)
      .filter(value => value !== undefined);

    const pinsKnockedDown = ballsThrown.reduce((a, b) => a + b, 0);

    return ballsThrown.length === 2 && pinsKnockedDown < 10;
  }

  protected get _isSpareFilledIn(): boolean {
    const startRoll = this._frameIndex * 2;
    const ballsThrown = this._rolls
      .slice(startRoll, startRoll + 2)
      .filter(value => value !== undefined);
    if (ballsThrown.length < 2) {
      return false;
    }

    if (!Frame._sumsToTen(ballsThrown)) {
      return false;
    }

    const fillBall = this._rolls[startRoll + 2];
    return fillBall !== undefined;
  }

  protected get _isStrikeFilledIn(): boolean {
    const startRoll = this._frameIndex * 2;
    const ballsThrown = this._rolls
      .slice(startRoll, startRoll + 1)
      .filter(value => value !== undefined);

    if (ballsThrown.length < 1) {
      return false;
    }

    if (!Frame._sumsToTen(ballsThrown)) {
      return false;
    }

    const fillBalls = this._rolls
      .slice(startRoll + 2)
      .filter(value => value !== undefined)
      .slice(0, 2);

    return fillBalls.length === 2;
  }

  private get _scoreUpToThisFrame(): number {
    const game = new Game();
    this._rolls.forEach(pins => game.roll(pins))
    return game.scoreUpToFrame(this._frameIndex);
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

  private static areBallsStartingAtIndexASpare(start: number, ballsThrown: number[]) {
    return Frame._sumsToTen(ballsThrown.slice(start, start + 2));
  }

  protected _isSpare(indexWithinFrame: number, ballsThrown: number[]): boolean {
    const areFirstTwoBallsASpare = TenthFrame.areBallsStartingAtIndexASpare(0, ballsThrown);
    if (indexWithinFrame === 1) {
      return areFirstTwoBallsASpare;
    }

    if (!areFirstTwoBallsASpare && indexWithinFrame === 2) {
      return TenthFrame.areBallsStartingAtIndexASpare(1, ballsThrown);
    }
    return false;
  }

  private get _isFrameFilled(): boolean {
    return this._rolls.slice(18, 21)
      .filter(value => value !== undefined)
      .length === 3;
  }

  get _isSpareFilledIn(): boolean {
    return this._isFrameFilled;
  }

  get _isStrikeFilledIn(): boolean {
    return this._isFrameFilled;
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