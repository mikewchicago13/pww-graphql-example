import {Card} from "./card";

export class HandMatchResult {
  private readonly _groupsOfCardsToCompare: Card[][];
  private readonly _description: string;

  static create({
                  doesMatch,
                  groupsOfCardsToCompare,
                  description
                }: {
    doesMatch: boolean,
    groupsOfCardsToCompare: Card[][],
    description: (cardsAfterSortingEachGroup: Card[][]) => string
  }): HandMatchResult{
    if(doesMatch){
      return new HandMatchResult({
        groupsOfCardsToCompare,
        description
      })
    }
    return new DoesNotMatchHandResult();
  }

  protected constructor({
                groupsOfCardsToCompare,
                description
              }: {
    groupsOfCardsToCompare: Card[][],
    description: (cardsAfterSortingEachGroup: Card[][]) => string
  }) {
    this._groupsOfCardsToCompare = groupsOfCardsToCompare
      .map(cards =>
        cards.sort((a, b) => b.numericValue - a.numericValue));
    this._description = description(this._groupsOfCardsToCompare);
  }

  get description(): string {
    return this._description;
  }
  get groupsOfCardsToCompare(): Card[][] {
    return this._groupsOfCardsToCompare;
  }
  get doesMatch(): boolean {
    return true;
  }
}

export class DoesNotMatchHandResult extends HandMatchResult {
  constructor() {
    super(
      {
        groupsOfCardsToCompare: [],
        description: () => ""
      }
    );
  }

  get doesMatch(): boolean {
    return false;
  }
}