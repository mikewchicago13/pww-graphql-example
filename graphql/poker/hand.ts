import {Card} from "./card";
import {Cards} from "./cards";
import {StraightFlush} from "./straightFlush";
import {FourOfAKind} from "./fourOfAKind";
import {FullHouse} from "./fullHouse";
import {Flush} from "./flush";
import {Straight} from "./straight";
import {ThreeOfAKind} from "./threeOfAKind";
import {TwoPairs} from "./twoPairs";
import {Pair} from "./pair";
import {HighCard} from "./highCard";

export class Hand {
  private readonly _name: string;
  private readonly _cards: Card[];

  static create({
                  cards,
                  name
                }: { cards: string; name: string }): Hand {
    return new Hand({
      name,
      cards: Cards.parse(cards)
    });
  }

  constructor(
    {
      cards,
      name
    }:
      {
        cards: Card[],
        name: string
      }) {
    this._name = name;
    this._cards = cards;
  }


  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._evaluateHandTypesFromBestToWorst()
      .filter(x => x.doesMatch)
      .map(x => x.description)[0];
  }

  toString(): string {
    const results = this._evaluateHandTypesFromBestToWorst();

    const sortableCardsForBestHandTypeMatched = results
      .filter(x => x.doesMatch)
      .map(x => x.sortableCards)[0];

    const sortableMatchForAllHandTypes = results.map(value => value.sortableMatch).join(" ");
    return sortableMatchForAllHandTypes + " " + sortableCardsForBestHandTypeMatched;
  }

  private _evaluateHandTypesFromBestToWorst(): {
    sortableMatch: string,
    sortableCards: string,
    description: string,
    doesMatch: boolean
  }[] {
    const fixedWidthNumericValue = (x: Card) => String(x.numericValue).padStart(2, "0");
    return [
      new StraightFlush(),
      new FourOfAKind(),
      new FullHouse(),
      new Flush(),
      new Straight(),
      new ThreeOfAKind(),
      new TwoPairs(),
      new Pair(),
      new HighCard()
    ]
      .map(handType => {
        const myHand = handType.parse(this._cards);
        return {
          doesMatch: myHand.doesMatch,
          sortableMatch: `${handType}: ${myHand.doesMatch ? "1" : "0"}`,
          description: `${handType}: ${myHand.description}`,
          sortableCards: myHand
            .groupsOfCardsToCompare
            .flat()
            .map(fixedWidthNumericValue) + ""
        };
      });
  }

  compareTo(b: Hand): number {
    if (this > b) {
      return -1;
    }
    if (b > this) {
      return 1;
    }
    return 0;
  }
}