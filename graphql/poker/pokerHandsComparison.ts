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
  static _countByProperty(cards: Card[], func: (x: Card) => string): any {
    return cards
      .map(value => func(value))
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

  static countByCardValue(cards: Card[]): any {
    return Cards._countByProperty(cards, x => x.numericValue + "");
  }

  static countBySuit(cards: Card[]): any {
    return Cards._countByProperty(cards, x => x.suit);
  }
}

class HandMatchResult {
  doesMatch: boolean;
  sortedListsOfCardsToCompare: Card[][];
  description: string;

  constructor({
                doesMatch,
                sortedListsOfCardsToCompare,
                description
              }: {
    doesMatch: boolean,
    sortedListsOfCardsToCompare: Card[][],
    description: (cardsAfterSortingEachGroup: Card[][]) => string
  }) {
    this.doesMatch = doesMatch;
    this.sortedListsOfCardsToCompare = sortedListsOfCardsToCompare
      .map(cards =>
        cards.sort((a, b) => b.numericValue - a.numericValue));
    this.description = description(this.sortedListsOfCardsToCompare);
  }
}

interface HandType {
  parse(cards: Card[]): HandMatchResult;

  toString(): string;
}

class HighCard implements HandType {
  parse(cards: Card[]): HandMatchResult {
    return new HandMatchResult({
        doesMatch: true,
        sortedListsOfCardsToCompare: [cards],
        description: (x: Card[][]) => String(x[0][0])[0]
      }
    )
  }

  toString(): string {
    return "High Card";
  }
}

class DoesNotMatchHandResult extends HandMatchResult {
  constructor(cards: Card[]) {
    super(
      {
        doesMatch: false,
        sortedListsOfCardsToCompare: [cards],
        description: x => x + ""
      }
    );
  }
}

class MultipleOfSameCardNumber implements HandType {
  private readonly _numberOfSameCardNumber: number;

  constructor(numberOfSameCardNumber: number) {
    this._numberOfSameCardNumber = numberOfSameCardNumber;
  }

  static description(cards: Card[]): string {
    return String(cards[0])[0] + "s";
  }

  static join(first: Card[], second: Card[], joinText: string): string {
    return [
      MultipleOfSameCardNumber.description(first),
      MultipleOfSameCardNumber.description(second)
    ]
      .join(joinText);
  }

  parse(cards: Card[]): HandMatchResult {
    const countByCardValue = Cards.countByCardValue(cards);

    for (const key in countByCardValue) {
      if (countByCardValue[key] === this._numberOfSameCardNumber) {
        const primaryCards =
          cards.filter(x => x.numericValue === Number(key));
        const remainingCards =
          cards.filter(x => x.numericValue !== Number(key));

        return new HandMatchResult({
          doesMatch: true,
          sortedListsOfCardsToCompare: [primaryCards, remainingCards],
          description: x => MultipleOfSameCardNumber.description(x[0])
        })
      }
    }

    return new DoesNotMatchHandResult(cards);
  }

  toString(): string {
    throw new Error("not applicable");
  }
}

class Pair implements HandType {
  toString(): string {
    return "Pair";
  }

  parse(cards: Card[]): HandMatchResult {
    return new MultipleOfSameCardNumber(2).parse(cards);
  }
}

class TwoPairs implements HandType {
  toString(): string {
    return "Two Pairs";
  }

  parse(cards: Card[]): HandMatchResult {
    const pairsFound = TwoPairs._pairsFound(Cards.countByCardValue(cards));

    if (pairsFound.length === 2) {
      return new HandMatchResult({
        doesMatch: true,
        sortedListsOfCardsToCompare: TwoPairs._separate(pairsFound, cards),
        description: (x: Card[][]) => MultipleOfSameCardNumber.join(x[0], x[1], " and ")
      })
    }

    return new DoesNotMatchHandResult(cards);
  }

  private static _separate(pairsFound: number[], cards: Card[]): Card[][] {
    const sortedDescending = pairsFound.sort((a, b) => b - a);
    const higherPair = sortedDescending[0];
    const lowerPair = sortedDescending[1];

    const primaryCards =
      cards.filter(x => x.numericValue === higherPair);
    const secondaryCards =
      cards.filter(x => x.numericValue === lowerPair);
    const remainingCards =
      cards.filter(x => ![higherPair, lowerPair].includes(x.numericValue));
    return [primaryCards, secondaryCards, remainingCards];
  }

  private static _pairsFound(countByCardValue: any): number[] {
    const pairsFound: number[] = [];
    for (const key in countByCardValue) {
      if (countByCardValue[key] === 2) {
        pairsFound.push(Number(key));
      }
    }
    return pairsFound;
  }
}

class ThreeOfAKind implements HandType {
  toString(): string {
    return "Three of a Kind";
  }

  parse(cards: Card[]): HandMatchResult {
    return new MultipleOfSameCardNumber(3).parse(cards);
  }
}

class Straight implements HandType {
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

    return new HandMatchResult(
      {
        doesMatch: isRegularStraight || isFiveHighStraight,
        sortedListsOfCardsToCompare: [isFiveHighStraight ? replaceAceWithOne : cards],
        description: (x: Card[][]) => String(x[0][0])[0] + " high"
      }
    );
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


class Flush implements HandType {
  toString(): string {
    return "Flush";
  }

  private static readonly _suitDisplay: any = {
    "C": "Clubs",
    "D": "Diamonds",
    "H": "Hearts",
    "S": "Spades"
  };

  public static partsFrom(cards: Card[]): {
    distinctSuits: any,
    description: (cardsAfterSortingEachGroup: Card[][]) => string
  } {
    const distinctSuits = Object.keys(Cards.countBySuit(cards));
    return {
      distinctSuits,
      description: (x: Card[][]) => String(x[0][0])[0] + " high in " + Flush._suitDisplay[distinctSuits[0]]
    }
  }

  parse(cards: Card[]): HandMatchResult {
    const {distinctSuits, description} = Flush.partsFrom(cards);
    const allCardsOfSameSuit = distinctSuits.length === 1;
    return new HandMatchResult({
      doesMatch: allCardsOfSameSuit,
      sortedListsOfCardsToCompare: [cards],
      description
    });
  }
}

class FullHouse implements HandType {
  toString(): string {
    return "Full House";
  }

  parse(cards: Card[]): HandMatchResult {
    const {
      doesMatch: hasThreeOfAKind,
      sortedListsOfCardsToCompare
    } = new ThreeOfAKind().parse(cards);
    const {doesMatch: hasPair} = new Pair().parse(cards);
    const isFullHouse = hasThreeOfAKind && hasPair;

    return new HandMatchResult({
      doesMatch: isFullHouse,
      sortedListsOfCardsToCompare,
      description: (x: Card[][]) =>
        isFullHouse ?
          MultipleOfSameCardNumber.join(x[0], x[1], " over ")
          : x + ""
    });
  }
}

class FourOfAKind implements HandType {
  toString(): string {
    return "Four of a Kind";
  }

  parse(cards: Card[]): HandMatchResult {
    return new MultipleOfSameCardNumber(4).parse(cards);
  }
}

class StraightFlush implements HandType {
  toString(): string {
    return "Straight Flush";
  }

  parse(cards: Card[]): HandMatchResult {
    const {description} = Flush.partsFrom(cards);
    const {doesMatch: isStraight, sortedListsOfCardsToCompare} = new Straight().parse(cards);
    const {doesMatch: isFlush} = new Flush().parse(cards);
    return new HandMatchResult({
      doesMatch: isFlush && isStraight,
      sortedListsOfCardsToCompare,
      description
    });
  }
}

const handTypesSortedFromBestToWorst: HandType[] = [
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
    this._cards = cards.split(" ")
      .map(x => new Card(x));
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._getResults()
      .filter(x => x.doesMatch)
      .map(x => x.description)[0];
  }

  toString(): string {
    const results = this._getResults();

    const firstMatchingHandGrouping = results
      .filter(x => x.doesMatch)
      .map(x => x.sortableCards)[0];

    return results.map(value => value.sortableMatch).join(" ") + " " + firstMatchingHandGrouping;
  }

  private _getResults(): {
    sortableMatch: string,
    sortableCards: string,
    description: string,
    doesMatch: boolean }[] {
    return handTypesSortedFromBestToWorst
      .map(handType => {
        const myHand = handType.parse(this._cards);
        const sortableMatch = `${handType}: ${myHand.doesMatch ? "1" : "0"}`;
        return {
          doesMatch: myHand.doesMatch,
          sortableMatch,
          description: `${handType}: ${myHand.description}`,
          sortableCards: myHand
            .sortedListsOfCardsToCompare
            .flat()
            .map(x => new EncodedCard(x)) + ""
        };
      });
  }
}

class Comparison {
  private readonly _one: Hand;
  private readonly _two: Hand;

  constructor(one: Hand, two: Hand) {
    this._one = one;
    this._two = two;
  }

  get one(): Hand {
    return this._one;
  }

  get two(): Hand {
    return this._two;
  }

  get debug(): string {
    return this._one.name + ": " + this.one +
      "\n" +
      this._two.name + ": " + this.two;
  }

  toString(): string {
    if (this._two + "" > this._one + "") {
      return this._two.name + " wins with " + this._two.description;
    } else if (this._one + "" > this._two + "") {
      return this._one.name + " wins with " + this._one.description;
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