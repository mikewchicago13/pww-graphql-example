import {ScoreSheet} from "./scoreSheet";

export class FrameUtilities {
  static wereAllPinsKnockedDown(ballsThrown: number[]): boolean {
    return ballsThrown.reduce((a, b) => a + b) === 10;
  }
}

export interface IndexedGame {
  scoreUpToFrame(frameIndex: number): number;
}

export interface IGame {
  roll(pins: number): IGame;

  get score(): number;

  get scoreSheet(): ScoreSheet;
}