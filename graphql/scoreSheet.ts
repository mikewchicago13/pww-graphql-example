import {IndexedGame} from "./bowling";

class FrameUtilities {
  static sumsToTen(ballsThrown: number[]): boolean {
    return ballsThrown.reduce((a, b) => a + b) === 10;
  }
}

class Marks {
  protected readonly _rolls: number[];
  private readonly _frameIndex: number;

  constructor(rolls: number[], frameIndex: number) {
    this._rolls = rolls;
    this._frameIndex = frameIndex;
  }

  get toArray(): (string | undefined)[] {
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
    return indexWithinFrame === 0 && FrameUtilities.sumsToTen([value]);
  }

  protected _isSpare(indexWithinFrame: number, ballsThrown: number[]) {
    return indexWithinFrame === 1 && FrameUtilities.sumsToTen(ballsThrown);
  }
}

class TenthFrameMarks extends Marks {
  constructor(rolls: number[], frameIndex: number) {
    super(rolls, frameIndex);
  }

  get _allowedNumberOfBallsThrown(): number {
    return 3;
  }

  protected _isStrike(_: number, value: number): boolean {
    return FrameUtilities.sumsToTen([value]);
  }

  private static areBallsStartingAtIndexASpare(start: number, ballsThrown: number[]) {
    return FrameUtilities.sumsToTen(ballsThrown.slice(start, start + 2));
  }

  protected _isSpare(indexWithinFrame: number, ballsThrown: number[]): boolean {
    const areFirstTwoBallsASpare = TenthFrameMarks.areBallsStartingAtIndexASpare(0, ballsThrown);
    if (indexWithinFrame === 1) {
      return areFirstTwoBallsASpare;
    }

    if (!areFirstTwoBallsASpare && indexWithinFrame === 2) {
      return TenthFrameMarks.areBallsStartingAtIndexASpare(1, ballsThrown);
    }
    return false;
  }
}

interface ConstructorParams {
  rolls: number[];
  frameIndex: number;
  scoreUpToFrame: number;
}

class RunningScore {
  protected readonly _rolls: number[];
  private readonly _frameIndex: number;
  private readonly _scoreUpToFrame: number;

  constructor({rolls, frameIndex, scoreUpToFrame}: ConstructorParams) {
    this._rolls = rolls;
    this._frameIndex = frameIndex;
    this._scoreUpToFrame = scoreUpToFrame;
  }

  get toNumber(): number | undefined {
    if (this._isOpenFrame || this._isStrikeFilledIn || this._isSpareFilledIn) {
      return this._scoreUpToFrame;
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

    if (!FrameUtilities.sumsToTen(ballsThrown)) {
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

    if (!FrameUtilities.sumsToTen(ballsThrown)) {
      return false;
    }

    const fillBalls = this._rolls
      .slice(startRoll + 2)
      .filter(value => value !== undefined)
      .slice(0, 2);

    return fillBalls.length === 2;
  }
}

class TenthFrameRunningScore extends RunningScore {
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

interface FrameComponents {
  marks: Marks;
  runningScore: RunningScore;
}

class DefaultFrameComponents implements FrameComponents{
  constructor(params: ConstructorParams) {
    this.marks = new Marks(params.rolls, params.frameIndex);
    this.runningScore = new RunningScore(params);
  }

  marks: Marks;
  runningScore: RunningScore;
}

class TenthFrameComponents implements FrameComponents{
  constructor(params: ConstructorParams) {
    this.marks = new TenthFrameMarks(params.rolls, params.frameIndex);
    this.runningScore = new TenthFrameRunningScore(params);
  }

  marks: Marks;
  runningScore: RunningScore;
}

class Frame {
  private readonly _components: FrameComponents;
  constructor(frameComponents: FrameComponents) {
    this._components = frameComponents;
  }

  get marks(): (string | undefined)[] {
    return this._components.marks.toArray;
  }

  get runningScore(): number | undefined {
    return this._components.runningScore.toNumber;
  }
}

class FrameFactory {
  static create(params: ConstructorParams) : Frame{
    const {frameIndex} = params;

    const isTenthFrame = frameIndex === 9;
    return new Frame(isTenthFrame ?
      new TenthFrameComponents(params):
      new DefaultFrameComponents(params));
  }
}

export class ScoreSheet {
  private readonly _rolls: number[];
  private readonly _game: IndexedGame;

  constructor(rolls: number[], game: IndexedGame) {
    this._rolls = rolls;
    this._game = game;
  }

  get frames(): Frame[] {
    return new Array(10).fill(0)
      .map((_, frameIndex) => {
        const scoreUpToFrame = this._game.scoreUpToFrame(frameIndex);
        return FrameFactory.create({
          rolls: this._rolls,
          frameIndex,
          scoreUpToFrame
        });
      });
  }
}