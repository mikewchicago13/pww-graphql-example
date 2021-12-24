class Card {
  private readonly _numericValue: number;
  private readonly _asString: string;

  constructor(character_suit: string) {
    this._asString = character_suit;
    const [character] = character_suit;
    this._numericValue = Card._toNumber(character);
  }

  private static _toNumber(character: string): number {
    const map: any = {
      "T": 10,
      "J": 11,
      "Q": 12,
      "K": 13,
      "A": 14
    }
    return map[character] || Number(character);
  }

  get numericValue(): number {
    return this._numericValue;
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

  private static _sortedFromHighestToLowest(cards: Card[]): number[] {
    return cards
      .map(c => c.numericValue)
      .sort((a, b) => b - a);
  }

  static isFirstGreaterThanSecond(first: Card[], second: Card[]): boolean {
    const me = Cards._sortedFromHighestToLowest(first);
    const you = Cards._sortedFromHighestToLowest(second);
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

interface HandMatchResult {
  name: string;
  doesMatch: boolean;
  primaryCards: Card[];
  secondaryCards: Card[];
  remainingCards: Card[];
}

interface HandType {
  parse(cards: Card[], name: string): HandMatchResult;

  toString(): string;
}

class HighCard implements HandType {
  parse(cards: Card[], name: string): HandMatchResult {
    return {
      name,
      doesMatch: true,
      primaryCards: cards,
      secondaryCards: [],
      remainingCards: []
    }
  }

  toString(): string {
    return "High Card";
  }
}

class Pair implements HandType {
  toString(): string {
    return "Pair";
  }

  parse(cards: Card[], name: string): HandMatchResult {
    const countByCardValue = Cards.countByCardValue(cards);

    for (const key in countByCardValue) {
      if (countByCardValue[key] === 2) {
        const primaryCards =
          cards.filter(x => x.numericValue === Number(key));
        const remainingCards =
          cards.filter(x => x.numericValue !== Number(key));

        return {
          name,
          doesMatch: true,
          primaryCards,
          secondaryCards: [],
          remainingCards
        }
      }
    }

    return {
      name,
      doesMatch: false,
      primaryCards: [],
      secondaryCards: [],
      remainingCards: cards
    }
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

      return {
        name,
        doesMatch: true,
        primaryCards,
        secondaryCards,
        remainingCards
      }

    }

    return {
      name,
      doesMatch: false,
      primaryCards: [],
      secondaryCards: [],
      remainingCards: cards
    }
  }
}

class Hand {
  private readonly _cardsInput: string;
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
    this._cardsInput = cards;
    this._name = name;
    this._cards = Cards.parse(cards);
  }

  get name(): string {
    return this._name;
  }

  toString(): string {
    return this._cardsInput;
  }

  isBetterThan(other: Hand): boolean {
    const handTypesSortedFromBestToWorst: HandType[] = [
      new TwoPairs(),
      new Pair(),
      new HighCard()
    ];

    for (const handType of handTypesSortedFromBestToWorst) {
      const myHand = handType.parse(this._cards, this._name);
      const otherHand = handType.parse(other._cards, other._name);

      if (myHand.doesMatch) {
        if (!otherHand.doesMatch) {
          console.log(`${this._name} has ${handType}, but ${other._name} does not`);
          return true;
        } else if (otherHand.doesMatch) {
          if (Cards.isFirstGreaterThanSecond(myHand.primaryCards, otherHand.primaryCards)) {
            console.log(`${handType}: ${this._name}.primaryCards (${myHand.primaryCards}) are better than ${otherHand.name}.primaryCards (${otherHand.primaryCards})`);
            return true;
          }

          if (Cards.isFirstGreaterThanSecond(myHand.secondaryCards, otherHand.secondaryCards)) {
            console.log(`${handType}: ${this._name}.secondaryCards (${myHand.secondaryCards}) are better than ${otherHand.name}.secondaryCards (${otherHand.secondaryCards})`);
            return true;
          }

          if (Cards.isFirstGreaterThanSecond(myHand.remainingCards, otherHand.remainingCards)) {
            console.log(`${handType}: ${this._name}.remainingCards (${myHand.remainingCards}) are better than ${otherHand.name}.remainingCards (${otherHand.remainingCards})`);
            return true;
          }
        }
      }
    }

    console.log(`default: ${this._name} not determined to be better than ${other._name}`);
    return false;
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

  toString(): string {
    if (this._two.isBetterThan(this._one)) {
      return this._two.name;
    } else if (this._one.isBetterThan(this._two)) {
      return this._one.name;
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