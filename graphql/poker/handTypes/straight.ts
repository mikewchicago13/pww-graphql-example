import {HandType} from "../handType";
import {Card, map} from "../card";
import {HandMatchResult, HandMatchResultFactory} from "../handMatchResult";

export class Straight implements HandType {
  toString(): string {
    return "Straight";
  }

  private static _regularStraights: number[][] = [
    [6, 5, 4, 3, 2],
    [7, 6, 5, 4, 3],
    [8, 7, 6, 5, 4],
    [9, 8, 7, 6, 5],
    [map.T, 9, 8, 7, 6],
    [map.J, map.T, 9, 8, 7],
    [map.Q, map.J, map.T, 9, 8],
    [map.K, map.Q, map.J, map.T, 9],
    [map.A, map.K, map.Q, map.J, map.T],
  ]

  static _arrayEquals(a: number[], b: number[]): boolean {
    return a.length === b.length &&
      a.every((val, index) => val === b[index]);
  }

  parse(cards: Card[]): HandMatchResult {
    const sorted = cards
      .map(c => c.numericValue)
      .sort((a, b) => b - a);

    const isRegularStraight = this._isRegularStraight(sorted);
    const {isFiveHighStraight, replaceAceWithOne} = this._fiveHighStraight(sorted, cards);

    return HandMatchResultFactory.create({
      doesMatch: isRegularStraight || isFiveHighStraight,
      groupsOfCardsToCompare: [isFiveHighStraight ? replaceAceWithOne : cards],
      description: (x: Card[][]) => String(x[0][0])[0] + " high"
    });
  }

  private _isRegularStraight(sorted: number[]) {
    return Straight._regularStraights
      .reduce((accumulator, validStraight) => {
        const matchesAKnownStraight = Straight._arrayEquals(validStraight, sorted);
        return accumulator || matchesAKnownStraight;
      }, false);
  }

  private _fiveHighStraight(sorted: number[], cards: Card[]): {
    isFiveHighStraight: boolean,
    replaceAceWithOne: Card[]
  } {
    const isFiveHighStraight = Straight._arrayEquals([map.A, 5, 4, 3, 2], sorted);
    const replaceAceWithOne = cards
      .map(value => {
        if (value.numericValue === map.A) {
          return new Card("1" + value.suit);
        }
        return value;
      })
    return {isFiveHighStraight, replaceAceWithOne};
  }
}