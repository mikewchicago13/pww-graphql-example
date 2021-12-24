const map: any = {
  "T": 10,
  "J": 11,
  "Q": 12,
  "K": 13,
  "A": 14
}

class Card {
  private readonly _numericValue: number;
  private readonly _asString: string;
  private readonly _suit: string;

  constructor(character_suit: string) {
    this._asString = character_suit;
    const [character, suit] = character_suit;
    this._suit = suit;
    this._numericValue = Card._toNumber(character);
  }

  private static _toNumber(character: string): number {
    return map[character] || Number(character);
  }

  get numericValue(): number {
    return this._numericValue;
  }

  get suit(): string {
    return this._suit;
  }

  toString(): string {
    return this._asString;
  }
}

class Cards {
  static parse(cards: string): Card[] {
    return cards.split(" ")
      .map(x => new Card(x));
  }

  static countByCardValue(cards: Card[]) {
    return cards
      .map(value => value.numericValue)
      .map(value => {
        const foo: any = {};
        foo[value] = 1;
        return foo;
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

  static sortedFromHighestToLowest(cards: Card[]): number[] {
    return cards
      .map(c => c.numericValue)
      .sort((a, b) => b - a);
  }
}

class HandMatchResult {
  name: string;
  doesMatch: boolean;
  sortedListsOfCardsToCompare: Card[][];

  constructor({
                name,
                doesMatch,
                sortedListsOfCardsToCompare
              }: {
    name: string,
    doesMatch: boolean,
    sortedListsOfCardsToCompare: Card[][]
  }) {
    this.name = name;
    this.doesMatch = doesMatch;
    this.sortedListsOfCardsToCompare = sortedListsOfCardsToCompare
      .map(cards =>
        cards.sort((a, b) => b.numericValue - a.numericValue));
  }

  static _isFirstGreaterThanSecond(first: Card[], second: Card[]): boolean {
    const me = Cards.sortedFromHighestToLowest(first);
    const you = Cards.sortedFromHighestToLowest(second);
    for (let i = 0; i < me.length; i++) {
      if (me[i] > you[i]) {
        return true;
      }
      if (you[i] > me[i]) {
        return false;
      }
    }

    return false;
  }
}

interface HandType {
  parse(cards: Card[], name: string): HandMatchResult;

  toString(): string;
}

class HighCard implements HandType {
  parse(cards: Card[], name: string): HandMatchResult {
    return new HandMatchResult({
        name,
        doesMatch: true,
        sortedListsOfCardsToCompare: [cards]
      }
    )
  }

  toString(): string {
    return "High Card";
  }
}

class HandWithSpecifiedNumberOfSameCardNumber implements HandType {
  private readonly _numberOfSameCardNumber: number;

  constructor(numberOfSameCardNumber: number) {
    this._numberOfSameCardNumber = numberOfSameCardNumber;
  }

  parse(cards: Card[], name: string): HandMatchResult {
    const countByCardValue = Cards.countByCardValue(cards);

    for (const key in countByCardValue) {
      if (countByCardValue[key] === this._numberOfSameCardNumber) {
        const primaryCards =
          cards.filter(x => x.numericValue === Number(key));
        const remainingCards =
          cards.filter(x => x.numericValue !== Number(key));

        return new HandMatchResult({
          name,
          doesMatch: true,
          sortedListsOfCardsToCompare: [primaryCards, remainingCards]
        })
      }
    }

    return new HandMatchResult({
      name,
      doesMatch: false,
      sortedListsOfCardsToCompare: [cards]
    })
  }

  toString(): string {
    throw new Error("not applicable");
  }
}

class Pair implements HandType {
  toString(): string {
    return "Pair";
  }

  parse(cards: Card[], name: string): HandMatchResult {
    return new HandWithSpecifiedNumberOfSameCardNumber(2).parse(cards, name);
  }
}

class TwoPairs implements HandType {
  toString(): string {
    return "Two Pairs";
  }

  parse(cards: Card[], name: string): HandMatchResult {
    const countByCardValue = Cards.countByCardValue(cards);

    const pairsFound: number[] = [];
    for (const key in countByCardValue) {
      if (countByCardValue[key] === 2) {
        pairsFound.push(Number(key));
      }
    }

    if (pairsFound.length === 2) {
      const sortedDescending = pairsFound.sort((a, b) => b - a);
      const higherPair = sortedDescending[0];
      const lowerPair = sortedDescending[1];

      const primaryCards =
        cards.filter(x => x.numericValue === higherPair);
      const secondaryCards =
        cards.filter(x => x.numericValue === lowerPair);
      const remainingCards =
        cards.filter(x => ![higherPair, lowerPair].includes(x.numericValue));

      return new HandMatchResult({
        name,
        doesMatch: true,
        sortedListsOfCardsToCompare: [primaryCards, secondaryCards, remainingCards]
      })

    }

    return new HandMatchResult({
        name,
        doesMatch: false,
        sortedListsOfCardsToCompare: [cards]
      }
    )
  }
}

class ThreeOfAKind implements HandType {
  toString(): string {
    return "Three of a Kind";
  }

  parse(cards: Card[], name: string): HandMatchResult {
    return new HandWithSpecifiedNumberOfSameCardNumber(3).parse(cards, name);
  }
}

class Straight implements HandType {
  toString(): string {
    return "Straight";
  }

  private static _fiveHighStraight: number[] = [map.A, 5, 4, 3, 2];

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

  parse(cards: Card[], name: string): HandMatchResult {
    const sorted = Cards.sortedFromHighestToLowest(cards);

    function arrayEquals(a: number[], b: number[]): boolean {
      return a.length === b.length &&
        a.every((val, index) => val === b[index]) &&
        b.every((val, index) => val === a[index]);
    }

    const isRegularStraight = Straight._regularStraights
      .reduce((accumulator, validStraight) => {
        const matchesAKnownStraight = arrayEquals(validStraight, sorted);
        return accumulator || matchesAKnownStraight;
      }, false);

    const isFiveHighStraight = arrayEquals(Straight._fiveHighStraight, sorted);
    const replaceAceWithOne = cards
      .map(value => {
        if (value.numericValue === map.A) {
          return new Card("1" + value.suit);
        }
        return value;
      })

    return new HandMatchResult(
      {
        name,
        doesMatch: isRegularStraight || isFiveHighStraight,
        sortedListsOfCardsToCompare: [isFiveHighStraight ? replaceAceWithOne : cards]
      }
    );
  }
}

const handTypesSortedFromBestToWorst: HandType[] = [
  new Straight(),
  new ThreeOfAKind(),
  new TwoPairs(),
  new Pair(),
  new HighCard()
];

class EncodedCard {
  private readonly _card: Card;

  constructor(card: Card) {
    this._card = card;
  }

  toString(): string {
    return String(this._card.numericValue).padStart(2, "0");
  }
}

class Hand {
  private readonly _name: string;
  private readonly _cards: Card[];

  constructor(
    {
      cards,
      name
    }:
      {
        cards: string,
        name: string
      }) {
    this._name = name;
    this._cards = Cards.parse(cards);
  }

  get name(): string {
    return this._name;
  }

  toString(): string {
    const results: string[] = [];
    let firstMatchingHandGrouping: string | undefined = undefined;
    for (let i = 0; i < handTypesSortedFromBestToWorst.length; i++) {
      const handType = handTypesSortedFromBestToWorst[i];
      const myHand = handType.parse(this._cards, this._name);
      results.push(`${handType}: ${myHand.doesMatch ? "1" : "0"}`)
      if (myHand.doesMatch && !firstMatchingHandGrouping) {
        firstMatchingHandGrouping = myHand
          .sortedListsOfCardsToCompare
          .flat()
          .map(x => new EncodedCard(x)) + "";
      }
    }
    return results.join(" ") + " " + firstMatchingHandGrouping;
  }
}

class Comparison {
  private readonly _one: Hand;
  private readonly _two: Hand;

  constructor(one: Hand, two: Hand) {
    this._one = one;
    this._two = two;
  }

  toString(): string {
    if (this._two + "" > this._one + "") {
      return this._two.name + ": " + this._two;
    } else if (this._one + "" > this._two + "") {
      return this._one.name + ": " + this._one;
    }
    return "Tie"
  }
}

export class PokerHandsInput {
  parse(input: string): Comparison {
    const [black, white] = input.split("  ").map(value => value.substring(7));
    return new Comparison(
      new Hand({cards: black, name: "Black"}),
      new Hand({cards: white, name: "White"})
    )
  }
}