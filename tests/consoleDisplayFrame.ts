export class ConsoleDisplayFrame {
  private readonly _runningScore: number;
  private readonly _ballsThrown: string[];

  constructor({runningScore, ballsThrown}: { runningScore: number; ballsThrown: string[] }) {
    this._runningScore = runningScore;
    this._ballsThrown = ballsThrown;
  }

  private static _nullSafe(x: any): string {
    return x || "";
  }

  get line1(): string {
    return this._ballsThrown
      .map(x => ConsoleDisplayFrame._nullSafe(x))
      .join("")
      .padEnd(3);
  }

  get line2(): string {
    return String(ConsoleDisplayFrame._nullSafe(this._runningScore)).padEnd(3);
  }

  static print(frames: any, func: (x: string) => void = console.log) {
    const map: ConsoleDisplayFrame[] = frames
      .map(({ballsThrown, runningScore}: { ballsThrown: string[], runningScore: number }) => {
        return new ConsoleDisplayFrame({ballsThrown, runningScore});
      });
    const separator = " | ";
    const line1 = map
      .map(value => value.line1)
      .join(separator)
    const line2 = map
      .map(value => value.line2)
      .join(separator)
    func(line1 + '\n' + line2)
  }
}