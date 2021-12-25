import {HandType} from "./handType";
import {HandMatchResult} from "./handMatchResult";
import {Card} from "./card";
import {StraightFlush} from "./handTypes/straightFlush";
import {FourOfAKind} from "./handTypes/fourOfAKind";
import {FullHouse} from "./handTypes/fullHouse";
import {Flush} from "./handTypes/flush";
import {Straight} from "./handTypes/straight";
import {ThreeOfAKind} from "./handTypes/threeOfAKind";
import {TwoPairs} from "./handTypes/twoPairs";
import {Pair} from "./handTypes/pair";
import {HighCard} from "./handTypes/highCard";

interface FormattedHandTypeEvaluation {
  readonly doesMatch: boolean;
  readonly readerFriendlyDescription: string;
  readonly cardsForTieBreaking: string;

  toString(): string;
}

class PopulatedFormattedHandTypeEvaluation implements FormattedHandTypeEvaluation {
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

class NullFormattedHandTypeEvaluation implements FormattedHandTypeEvaluation {
  toString(): string {
    return "";
  }

  get doesMatch(): boolean {
    return false;
  }

  get readerFriendlyDescription(): string {
    return "";
  }

  get cardsForTieBreaking(): string {
    return ""
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
    return this._isFirstMatch(next) ? this._firstMatch(next) : this._next(next);
  }

  private _isFirstMatch(next: FormattingChainOfResponsibility) {
    return !this._hasPreviousMatch && next._formattedHandTypeEvaluation.doesMatch;
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

export class FormattingChainOfResponsibilityFactory {
  static create(cards: Card[]): FormattingChainOfResponsibility {
    return FormattingChainOfResponsibilityFactory._handTypesFromBestToWorst()
      .map((value) => new PopulatedFormattedHandTypeEvaluation(value, cards))
      .map((value) => new FormattingChainOfResponsibility(value))
      .reduce((a, b) => a.append(b), new FormattingChainOfResponsibility());
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
}