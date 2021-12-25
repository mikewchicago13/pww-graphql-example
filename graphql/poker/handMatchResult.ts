import {Card} from "./card";

export class HandMatchResult {
  private readonly _doesMatch: boolean;
  private readonly _groupsOfCardsToCompare: Card[][];
  private readonly _description: string;

  constructor({
                doesMatch,
                groupsOfCardsToCompare,
                description
              }: {
    doesMatch: boolean,
    groupsOfCardsToCompare: Card[][],
    description: (cardsAfterSortingEachGroup: Card[][]) => string
  }) {
    this._doesMatch = doesMatch;
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
    return this._doesMatch;
  }
}

export class DoesNotMatchHandResult extends HandMatchResult {
  constructor(cards: Card[]) {
    super(
      {
        doesMatch: false,
        groupsOfCardsToCompare: [cards],
        description: x => x + ""
      }
    );
  }
}