export interface IndexedGame {
  scoreUpToFrame(frameIndex: number): number;
}

export class FrameUtilities {
  static wereAllPinsKnockedDown(ballsThrown: number[]): boolean {
    return ballsThrown.reduce((a, b) => a + b) === 10;
  }
}