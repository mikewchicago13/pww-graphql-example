const map: any = {
  "T": 10,
  "J": 11,
  "Q": 12,
  "K": 13,
  "A": 14
}

export class Card {
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

class HandMatchResult {
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

interface HandType {
  parse(cards: Card[]): HandMatchResult;

  toString(): string;
}

class HighCard implements HandType {
  parse(cards: Card[]): HandMatchResult {
    return new HandMatchResult({
        doesMatch: true,
        groupsOfCardsToCompare: [cards],
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
        groupsOfCardsToCompare: [cards],
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
          groupsOfCardsToCompare: [primaryCards, remainingCards],
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
        groupsOfCardsToCompare: TwoPairs._separate(pairsFound, cards),
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
        groupsOfCardsToCompare: [isFiveHighStraight ? replaceAceWithOne : cards],
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
    distinctSuits: string[],
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
      groupsOfCardsToCompare: [cards],
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
      groupsOfCardsToCompare
    } = new ThreeOfAKind().parse(cards);
    const {doesMatch: hasPair} = new Pair().parse(cards);
    const isFullHouse = hasThreeOfAKind && hasPair;

    return new HandMatchResult({
      doesMatch: isFullHouse,
      groupsOfCardsToCompare: groupsOfCardsToCompare,
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
    const {doesMatch: isStraight, groupsOfCardsToCompare} = new Straight().parse(cards);
    const {doesMatch: isFlush} = new Flush().parse(cards);
    return new HandMatchResult({
      doesMatch: isFlush && isStraight,
      groupsOfCardsToCompare: groupsOfCardsToCompare,
      description
    });
  }
}

class SortableCard {
  private readonly _card: Card;

  constructor(card: Card) {
    this._card = card;
  }

  toString(): string {
    return String(this._card.numericValue).padStart(2, "0");
  }
}

export class Hand {
  private readonly _name: string;
  private readonly _cards: Card[];

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
    this._name = name;
    this._cards = cards;
  }


  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._evaluateHandTypesFromBestToWorst()
      .filter(x => x.doesMatch)
      .map(x => x.description)[0];
  }

  toString(): string {
    const results = this._evaluateHandTypesFromBestToWorst();

    const sortableCardsForBestHandTypeMatched = results
      .filter(x => x.doesMatch)
      .map(x => x.sortableCards)[0];

    const sortableMatchForAllHandTypes = results.map(value => value.sortableMatch).join(" ");
    return sortableMatchForAllHandTypes + " " + sortableCardsForBestHandTypeMatched;
  }

  private _evaluateHandTypesFromBestToWorst(): {
    sortableMatch: string,
    sortableCards: string,
    description: string,
    doesMatch: boolean
  }[] {
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
    ]
      .map(handType => {
        const myHand = handType.parse(this._cards);
        return {
          doesMatch: myHand.doesMatch,
          sortableMatch: `${handType}: ${myHand.doesMatch ? "1" : "0"}`,
          description: `${handType}: ${myHand.description}`,
          sortableCards: myHand
            .groupsOfCardsToCompare
            .flat()
            .map(x => new SortableCard(x)) + ""
        };
      });
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

  static _winner(hand: Hand): string {
    return `${hand.name} wins with ${hand.description}`;
  }

  toString(): string {
    if (this.two.compareTo(this.one) === 0) {
      return "Tie";
    }

    const winner = [this.one, this.two]
      .sort((a, b) => a.compareTo(b))
      [0];

    return Comparison._winner(winner);
  }
}

export class PokerHandsInput {
  parse(input: string): Comparison {
    const [black, white] = input.split("  ").map(value => value.substring(7));
    return new Comparison(
      Hand.create({cards: black, name: "Black"}),
      Hand.create({cards: white, name: "White"})
    )
  }
}