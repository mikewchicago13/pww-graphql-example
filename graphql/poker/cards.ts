import {Card} from "./card";

export class Cards {
  static _countByProperty(cards: Card[], func: (x: Card) => string): any {
    return cards
      .map(value => func(value))
      .map(value => {
        const map: any = {};
        map[value] = 1;
        return map;
      })
      .reduce((accumulatorMap, mapWithOne) => {
        for (const num in mapWithOne) {
          if (accumulatorMap[num]) {
            accumulatorMap[num] += 1;
          } else {
            accumulatorMap[num] = 1;
          }
        }
        return accumulatorMap;
      }, {});
  }

  static countByCardValue(cards: Card[]): any {
    return Cards._countByProperty(cards, x => x.numericValue + "");
  }

  static countBySuit(cards: Card[]): any {
    return Cards._countByProperty(cards, x => x.suit);
  }

  static parse(cards: string): Card[] {
    return cards.split(" ").map(x => new Card(x));
  }
}