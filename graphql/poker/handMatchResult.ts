import {Card} from "./card";

export interface HandMatchResult {
  readonly description: string;
  readonly groupsOfCardsToCompare: Card[][];
  readonly doesMatch: boolean;
}

export class HandMatchResultFactory{
  static create({
                  doesMatch,
                  groupsOfCardsToCompare,
                  description
                }: {
    doesMatch: boolean,
    groupsOfCardsToCompare: Card[][],
    description: (cardsAfterSortingEachGroup: Card[][]) => string
  }): HandMatchResult {
    if(doesMatch){
      return new PositiveMatchResult({
        groupsOfCardsToCompare,
        description
      })
    }
    return HandMatchResultFactory.noMatchDetected();
  }
  static noMatchDetected(): HandMatchResult {
    return new NegativeMatchResult();
  }
}

class PositiveMatchResult implements HandMatchResult {
  private readonly _groupsOfCardsToCompare: Card[][];
  private readonly _description: (cardsAfterSortingEachGroup: Card[][]) => string;
  constructor({
                groupsOfCardsToCompare,
                description
              }: {
    groupsOfCardsToCompare: Card[][],
    description: (cardsAfterSortingEachGroup: Card[][]) => string
  }) {
    this._groupsOfCardsToCompare = groupsOfCardsToCompare
      .map(cards =>
        cards.sort((a, b) => b.numericValue - a.numericValue));
    this._description = description;
  }

  get description(): string {
    return this._description(this.groupsOfCardsToCompare);
  }

  get groupsOfCardsToCompare(): Card[][] {
    return this._groupsOfCardsToCompare;
  }

  get doesMatch(): boolean {
    return true;
  }
}

class NegativeMatchResult implements HandMatchResult {
  get doesMatch(): boolean {
    return false;
  }

  get description(): string{
    return "";
  }

  get groupsOfCardsToCompare(): Card[][]{
    return [];
  }
}