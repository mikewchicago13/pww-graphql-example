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
    const chain: FormattingChainOfResponsibility = Hand._formattingChainOfResponsibility(cards);
    this._sortableString = String(chain);
    this._description = chain.readerFriendlyDescription;
  }

  private static _formattingChainOfResponsibility(cards: Card[]): FormattingChainOfResponsibility {
    return Hand._handTypesFromBestToWorst()
      .map((value) => new FormattedHandTypeEvaluation(value, cards))
      .map((value) => new FormattingChainOfResponsibility(value))
      .reduce((a, b) => a.append(b), new FormattingChainOfResponsibility());
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

class FormattedHandTypeEvaluation {
  private readonly _handType: HandType;
  private readonly _handMatchResult: HandMatchResult;

  constructor(value: HandType, cards: Card[]) {
    this._handType = value;
    this._handMatchResult = this._handType.parse(cards);
  }

  get doesMatch(): boolean {
    return this._handMatchResult.doesMatch;
  }

  toString(): string {
    return `${this._handType}: ${this._handMatchResult.doesMatch ? "1" : "0"}`;
  }

  get readerFriendlyDescription(): string {
    return `${this._handType}: ${this._handMatchResult.description}`;
  }

  get cardsForTieBreaking(): string {
    const fixedWidthNumericValue = (x: Card) => String(x.numericValue).padStart(2, "0");
    return this._handMatchResult
      .groupsOfCardsToCompare
      .flat()
      .map(fixedWidthNumericValue) + "";
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

class NullFormattedHandTypeEvaluation extends FormattedHandTypeEvaluation {
  constructor() {
    super(new NullHandType(), []);
  }

  toString(): string {
    return "";
  }
}

class FormattingChainOfResponsibility {
  private readonly _formattedHandTypeEvaluation: FormattedHandTypeEvaluation;
  private readonly _cardsForTieBreaking: string;
  private readonly _sortableDescriptions: string[];
  private readonly _hasPreviousMatch: boolean;
  private readonly _readerFriendlyDescription: string;

  constructor(
    formattedHandTypeEvaluation: FormattedHandTypeEvaluation = new NullFormattedHandTypeEvaluation(),
    sortableDescriptions: string[] = [],
    hasPreviousMatch: boolean = false,
    cardsForTieBreaking: string = "",
    readerFriendlyDescription: string = ""
  ) {
    this._formattedHandTypeEvaluation = formattedHandTypeEvaluation;
    this._sortableDescriptions = sortableDescriptions.length ? sortableDescriptions : [String(formattedHandTypeEvaluation)];
    this._hasPreviousMatch = hasPreviousMatch;
    this._cardsForTieBreaking = cardsForTieBreaking;
    this._readerFriendlyDescription = readerFriendlyDescription;
  }

  append(next: FormattingChainOfResponsibility): FormattingChainOfResponsibility {
    if (!this._hasPreviousMatch && next._formattedHandTypeEvaluation.doesMatch) {
      return this._firstMatch(next);
    }
    return this._next(next);
  }

  private _next(next: FormattingChainOfResponsibility): FormattingChainOfResponsibility {
    return new FormattingChainOfResponsibility(next._formattedHandTypeEvaluation,
      this._sortableDescriptions.concat(next._sortableDescriptions),
      this._hasPreviousMatch,
      this._cardsForTieBreaking,
      this._readerFriendlyDescription
    );
  }

  private _firstMatch(next: FormattingChainOfResponsibility): FormattingChainOfResponsibility {
    return new FormattingChainOfResponsibility(
      next._formattedHandTypeEvaluation,
      this._sortableDescriptions.concat(next._sortableDescriptions),
      true,
      next._formattedHandTypeEvaluation.cardsForTieBreaking,
      next._formattedHandTypeEvaluation.readerFriendlyDescription
    )
  }

  toString(): string {
    return this._sortableDescriptions.join(" ").trim() + " " + this._cardsForTieBreaking;
  }

  get readerFriendlyDescription(): string {
    return this._readerFriendlyDescription;
  }
}
