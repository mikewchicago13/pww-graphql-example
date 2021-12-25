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

export class Hand {
  private readonly _name: string;
  private readonly _sortableString: string;
  private readonly _description: string;

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
    const chain: Chain = Hand._chainOfResponsibility(cards);
    this._sortableString = String(chain);
    this._description = chain.readerFriendlyDescription;
  }

  private static _chainOfResponsibility(cards: Card[]) : Chain {
    return Hand._handTypesFromBestToWorst()
      .map((value) => new HandTypeLink(value, cards))
      .map((value) => new Chain(value))
      .reduce((a, b) => a.append(b), new Chain());
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  toString(): string {
    return this._sortableString;
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

class HandTypeLink {
  private readonly _handType: HandType;
  private readonly _handMatchResult: HandMatchResult;

  constructor(value: HandType, cards: Card[]) {
    this._handType = value;
    this._handMatchResult = this._handType.parse(cards);
  }

  get handMatchResult(): HandMatchResult {
    return this._handMatchResult;
  }

  toString(): string {
    return `${this._handType}: ${this.handMatchResult.doesMatch ? "1" : "0"}`;
  }

  get readerFriendlyDescription() : string{
    return `${this._handType}: ${this.handMatchResult.description}`;
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
  private readonly _sortableDescriptions: string[];
  private readonly _hasPreviousMatch: boolean;
  private readonly _readerFriendlyDescription: string;

  constructor(
    link: HandTypeLink = new NullHandTypeLink(),
    descriptions: string[] = [],
    hasPreviousMatch: boolean = false,
    cardsForTieBreaking: string = "",
    readerFriendlyDescription: string = ""
  ) {
    this._link = link;
    this._sortableDescriptions = descriptions.length ? descriptions : [String(link)];
    this._hasPreviousMatch = hasPreviousMatch;
    this._cardsForTieBreaking = cardsForTieBreaking;
    this._readerFriendlyDescription = readerFriendlyDescription;
  }

  append(next: Chain): Chain {
    if (!this._hasPreviousMatch && next._link.handMatchResult.doesMatch) {
      return this._handleFirstMatch(next);
    }
    return new Chain(next._link,
      this._sortableDescriptions.concat(next._sortableDescriptions),
      this._hasPreviousMatch,
      this._cardsForTieBreaking,
      this._readerFriendlyDescription
    );
  }

  private _handleFirstMatch(next: Chain) {
    return new Chain(
      next._link,
      this._sortableDescriptions.concat(next._sortableDescriptions),
      true,
      this._formatCardsForTieBreaking(next._link.handMatchResult),
      next._link.readerFriendlyDescription
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
    return this._sortableDescriptions.join(" ").trim() + " " + this._cardsForTieBreaking;
  }

  get readerFriendlyDescription() : string{
    return this._readerFriendlyDescription;
  }
}
