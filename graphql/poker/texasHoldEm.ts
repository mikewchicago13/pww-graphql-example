import {EOL} from "os";
import {Card, Hand} from "./pokerHandsComparison";

export class TexasHoldEmHand {
  private readonly _cards: Card[];
  private readonly _allPossibleHands: Hand[];

  constructor(cards: string) {
    this._cards = cards.split(" ").map(x => new Card(x));
    this._allPossibleHands = TexasHoldEmHand._combinations(
      this._cards,
      5).map((value, index) => {
      return new Hand({cards: value, name: index + ""})
    })
  }

  static _combinations(
    arr: Card[],
    len: number
  ): Card[][] {
    if (len === 0) {
      return [[]];
    }
    return arr
      .map((card, index) =>
        TexasHoldEmHand._combinations(arr.slice(index + 1), len - 1)
          .map(x => [card].concat(x)))
      .flat();
  }

  get cards(): Card[] {
    return this._cards;
  }

  get allPossibleHands(): Hand[] {
    return this._allPossibleHands;
  }
}

export class TexasHoldEm {
  static parse(input: string): TexasHoldEmHand[] {
    return input.split(EOL)
      .map(value => new TexasHoldEmHand(value));
  }
}