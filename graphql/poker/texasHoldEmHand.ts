import {Card} from "./card";
import {Hand} from "./hand";
import {Cards} from "./cards";

export class TexasHoldEmHand {
  private readonly _cards: Card[];
  private readonly _handsFromBestToWorst: Hand[];
  private readonly _name: string;

  constructor(cards: string) {
    this._name = cards;
    this._cards = Cards.parse(cards);
    this._handsFromBestToWorst = TexasHoldEmHand._combinations(
      this._cards,
      5).map(TexasHoldEmHand._createHand)
      .sort((a, b) => a.compareTo(b))
  }

  private static _createHand(cards: Card[], index: number): Hand {
    return new Hand({cards, name: index + ""});
  }

  private static _combinations(
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

  get name(): string {
    return this._name;
  }

  get handsFromBestToWorst(): Hand[] {
    return this._handsFromBestToWorst;
  }

  get description(): string {
    return this._hasEnoughCards() ? this._bestHand().description : "";
  }

  private _hasEnoughCards(): boolean {
    return this._cards.length === 7;
  }

  private _bestHand(): Hand {
    return this._handsFromBestToWorst[0];
  }

  toString(): string {
    return this._hasEnoughCards() ? this._bestHand() + "" : "";
  }

  compareTo(b: TexasHoldEmHand): number {
    if (!b._hasEnoughCards()) {
      return -1;
    }
    if (!this._hasEnoughCards()) {
      return 1;
    }
    if (this > b) {
      return -1;
    }
    if (b > this) {
      return 1;
    }
    return 0;
  }
}