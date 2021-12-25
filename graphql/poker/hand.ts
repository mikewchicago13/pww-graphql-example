import {Card} from "./card";
import {Cards} from "./cards";
import {StraightFlush} from "./handTypes/straightFlush";
import {FourOfAKind} from "./handTypes/fourOfAKind";
import {FullHouse} from "./handTypes/fullHouse";
import {Flush} from "./handTypes/flush";
import {Straight} from "./handTypes/straight";
import {ThreeOfAKind} from "./handTypes/threeOfAKind";
import {TwoPairs} from "./handTypes/twoPairs";
import {Pair} from "./handTypes/pair";
import {HighCard} from "./handTypes/highCard";
import {HandType} from "./handType";

interface HandTypeEvaluation{
  sortableMatch: string,
  sortableCards: string,
  description: string,
  doesMatch: boolean
}

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
    const maximum = 5;
    if(cards.length > maximum){
      throw new Error(`${cards} has more than ${maximum} cards`);
    }
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
    return Hand._getComparableWithAllHandTypesMappedToOnesAndZeros(results) +
      " " +
      Hand._getSortableCardsToBreakTiesWhenHandTypeIsEqual(results);
  }

  private static _getSortableCardsToBreakTiesWhenHandTypeIsEqual(results: HandTypeEvaluation[]) {
    return results
      .filter(x => x.doesMatch)
      .map(x => x.sortableCards)[0];
  }

  private static _getComparableWithAllHandTypesMappedToOnesAndZeros(results: HandTypeEvaluation[]) {
    return results.map(value => value.sortableMatch).join(" ");
  }

  private _evaluateHandTypesFromBestToWorst(): HandTypeEvaluation[] {
    return Hand._handTypesFromBestToWorst()
      .map(handType => this._evaluate(handType));
  }

  private _evaluate(handType: HandType): HandTypeEvaluation {
    const fixedWidthNumericValue = (x: Card) => String(x.numericValue).padStart(2, "0");
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
  }

  private static _handTypesFromBestToWorst(): HandType[] {
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
    ];
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