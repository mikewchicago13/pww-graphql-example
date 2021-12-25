import {Card} from "./card";

export class HandMatchResult {
  doesMatch: boolean;
  groupsOfCardsToCompare: Card[][];
  description: string;

  constructor({
                doesMatch,
                groupsOfCardsToCompare,
                description
              }: {
    doesMatch: boolean,
    groupsOfCardsToCompare: Card[][],
    description: (cardsAfterSortingEachGroup: Card[][]) => string
  }) {
    this.doesMatch = doesMatch;
    this.groupsOfCardsToCompare = groupsOfCardsToCompare
      .map(cards =>
        cards.sort((a, b) => b.numericValue - a.numericValue));
    this.description = description(this.groupsOfCardsToCompare);
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