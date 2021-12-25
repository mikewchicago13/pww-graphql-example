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
import {HandMatchResult, HandMatchResultFactory} from "./handMatchResult";

interface HandTypeEvaluation {
  description: string,
  doesMatch: boolean
}

export class Hand {
  private readonly _name: string;
  private readonly _cards: Card[];
  private readonly _handTypesEvaluatedFromBestToWorst: HandTypeEvaluation[];

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
    if (cards.length > maximum) {
      throw new Error(`${cards} has more than ${maximum} cards`);
    }
    this._name = name;
    this._cards = cards;
    this._handTypesEvaluatedFromBestToWorst = this._evaluateHandTypesFromBestToWorst();
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._handTypesEvaluatedFromBestToWorst
      .filter(x => x.doesMatch)
      .map(x => x.description)[0];
  }

  toString(): string {
    return this._chainOfResponsibility();
  }

  private _evaluateHandTypesFromBestToWorst(): HandTypeEvaluation[] {
    return Hand._handTypesFromBestToWorst()
      .map(handType => this._evaluate(handType));
  }

  private _evaluate(handType: HandType): HandTypeEvaluation {
    const myHand: HandMatchResult = handType.parse(this._cards);
    return {
      doesMatch: myHand.doesMatch,
      description: `${handType}: ${myHand.description}`
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

  private _chainOfResponsibility(): string {
    const chain: Chain = Hand._handTypesFromBestToWorst()
      .map((value) => new HandTypeLink(value, this._cards))
      .map((value) => new Chain(value))
      .reduce((a, b) => a.append(b), new Chain(new NullHandTypeLink()));
    return String(chain);
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

class HandTypeLink {
  private readonly _value: HandType;
  private readonly _handMatchResult: HandMatchResult;

  constructor(value: HandType, cards: Card[]) {
    this._value = value;
    this._handMatchResult = this._value.parse(cards);
  }

  get handMatchResult(): HandMatchResult {
    return this._handMatchResult;
  }

  toString(): string {
    return `${this._value}: ${this.handMatchResult.doesMatch ? "1" : "0"}`;
  }
}

class NullHandType implements HandType {
  parse(_: Card[]): HandMatchResult {
    return HandMatchResultFactory.noMatchDetected();
  }

  toString(): string {
    return "";
  }
}

class NullHandTypeLink extends HandTypeLink {
  constructor() {
    super(new NullHandType(), []);
  }

  toString(): string {
    return "";
  }
}

class Chain {
  private readonly _link: HandTypeLink;
  private readonly _cardsForTieBreaking: string;
  private readonly _descriptions: string[];
  private readonly _hasPreviousMatch: boolean;

  constructor(
    link: HandTypeLink,
    descriptions: string[] = [],
    hasPreviousMatch: boolean = false,
    cardsForTieBreaking: string = ""
  ) {
    this._link = link;
    this._descriptions = descriptions.length ? descriptions : [String(link)];
    this._hasPreviousMatch = hasPreviousMatch;
    this._cardsForTieBreaking = cardsForTieBreaking;
  }

  append(next: Chain): Chain {
    if (!this._hasPreviousMatch && next._link.handMatchResult.doesMatch) {
      return this._handleFirstMatch(next);
    }
    return new Chain(next._link,
      this._descriptions.concat(next._descriptions),
      this._hasPreviousMatch,
      this._cardsForTieBreaking
    );
  }

  private _handleFirstMatch(next: Chain) {
    return new Chain(
      next._link,
      this._descriptions.concat(next._descriptions),
      true,
      this._formatCardsForTieBreaking(next._link.handMatchResult)
    )
  }

  private _formatCardsForTieBreaking(handMatchResult: HandMatchResult): string {
    const fixedWidthNumericValue = (x: Card) => String(x.numericValue).padStart(2, "0");
    return handMatchResult
      .groupsOfCardsToCompare
      .flat()
      .map(fixedWidthNumericValue) + "";
  }

  toString(): string {
    return this._descriptions.join(" ").trim() + " " + this._cardsForTieBreaking;
  }
}
