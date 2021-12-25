import {EOL} from "os";
import {TexasHoldEmHand} from "./texasHoldEmHand";

export class TexasHoldEm {
  private readonly _hands: TexasHoldEmHand[];
  private readonly _winningHand: TexasHoldEmHand;
  constructor(input: string) {
    this._hands = TexasHoldEm.toHands(input);
    this._winningHand = TexasHoldEm._winner(this._hands);
  }

  static parse(input: string): TexasHoldEm {
    return new TexasHoldEm(input);
  }

  private static toHands(input: string): TexasHoldEmHand[] {
    return input.split(EOL)
      .map(x => x.trim())
      .map(value => new TexasHoldEmHand(value));
  }

  toString(): string {
    return this._hands
      .map((value) => this.formatLine(value))
      .join(EOL);
  }

  private formatLine(value: TexasHoldEmHand) {
    return `${value.name} ${value.description} ${this._winnerSuffix(value)}`.trim()
  }

  private _winnerSuffix(value: TexasHoldEmHand) {
    return this._isWinner(value) ? "(winner)" : "";
  }

  private _isWinner(value: TexasHoldEmHand) : boolean {
    return String(value) === String(this._winningHand);
  }

  private static _winner(hands: TexasHoldEmHand[]): TexasHoldEmHand {
    return [...hands]
      .sort((a, b) => a.compareTo(b))[0];
  }
}