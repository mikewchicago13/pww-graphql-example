import {Hand} from "./hand";

export class Comparison {
  private readonly _one: Hand;
  private readonly _two: Hand;

  constructor(one: Hand, two: Hand) {
    this._one = one;
    this._two = two;
  }

  static _winner(hand: Hand): string {
    return `${hand.name} wins with ${hand.description}`;
  }

  toString(): string {
    if (this._two.compareTo(this._one) === 0) {
      return "Tie";
    }

    const winner = [this._one, this._two]
      .sort((a, b) => a.compareTo(b))
      [0];

    return Comparison._winner(winner);
  }
}