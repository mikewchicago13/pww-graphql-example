import {EOL} from "os";
import {Card, Hand} from "./pokerHandsComparison";

export class TexasHoldEmHand {
  private readonly _cards: Card[];
  private readonly _allPossibleHands: Hand[];
  private readonly _name: string;

  constructor(cards: string) {
    this._name = cards;
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

  get name(): string{
    return this._name;
  }

  get allPossibleHands(): Hand[] {
    return this._allPossibleHands;
  }

  get description(): string {
    return this.hasEnoughCards() ? this._bestHand().description : "";
  }

  public hasEnoughCards() {
    return this._cards.length === 7;
  }

  private _bestHand(): Hand {
    const bestToWorst = (a: Hand, b: Hand) => {
      if (a > b) {
        return -1;
      }
      if (b > a) {
        return 1;
      }
      return 0;
    };
    return this._allPossibleHands.sort(bestToWorst)[0];
  }

  toString(): string {
    return this.hasEnoughCards() ? this._bestHand() + "" : "";
  }
}

export class TexasHoldEm {
  static parse(input: string): TexasHoldEmHand[] {
    return input.split(EOL)
      .map(x => x.trim())
      .map(value => new TexasHoldEmHand(value));
  }

  static toOutput(input: string): string {
    const texasHoldEmHands = TexasHoldEm.parse(input);
    const bestToWorst = (a: TexasHoldEmHand, b: TexasHoldEmHand) => {
      if(!b.hasEnoughCards()){
        return -1;
      }
      if(!a.hasEnoughCards()){
        return 1;
      }
      if (a > b) {
        return -1;
      }
      if (b > a) {
        return 1;
      }
      return 0;
    };

    const winner = texasHoldEmHands.sort(bestToWorst)[0];

    return texasHoldEmHands
      .map((value) => {
        return `${value.name} ${value.description} ${value === winner ? "(winner)": ""}`.trim()
      })
      .join(EOL);
  }
}