import {Hand} from "./hand";

export class Comparison {
  private readonly _one: Hand;
  private readonly _two: Hand;

  constructor(one: Hand, two: Hand) {
    this._one = one;
    this._two = two;
  }

  get one(): Hand {
    return this._one;
  }

  get two(): Hand {
    return this._two;
  }

  get debug(): string {
    return this._one.name + ": " + this.one +
      "\n" +
      this._two.name + ": " + this.two;
  }

  static _winner(hand: Hand): string {
    return `${hand.name} wins with ${hand.description}`;
  }

  toString(): string {
    if (this.two.compareTo(this.one) === 0) {
      return "Tie";
    }

    const winner = [this.one, this.two]
      .sort((a, b) => a.compareTo(b))
      [0];

    return Comparison._winner(winner);
  }
}