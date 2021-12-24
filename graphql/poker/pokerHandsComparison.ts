class Card {
  private readonly _numericValue: number;

  constructor(character_suit: string) {
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
}

class Cards {
  static parse(cards: string): Card[] {
    return cards.split(" ")
      .map(x => new Card(x));
  }
}

interface HandMatchResult {
  name: string;
  doesMatch: boolean;
  primaryCards: Card[];
  // secondaryCards : Card[];
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
    const countByCardValue = cards
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

    console.log(name, JSON.stringify(countByCardValue));

    for (const key in countByCardValue) {
      if (countByCardValue[key] === 2) {

        const primaryCards =
          cards
            .filter(x => x.numericValue === Number(key));
        const remainingCards =
          cards
            .filter(x => x.numericValue !== Number(key));

        return {
          name,
          doesMatch: true,
          primaryCards,
          remainingCards
        }
      }
    }

    return {
      name,
      doesMatch: false,
      primaryCards: [],
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

  private static _sortedByNumericValue(cards: Card[]): number[] {
    return cards
      .map(c => c.numericValue)
      .sort((a, b) => b - a);
  }

  toString(): string {
    return this._cardsInput;
  }

  isBetterThan(other: Hand): boolean {
    const handTypesSortedFromBestToWorst: HandType[] = [
      new Pair(),
      new HighCard()
    ];

    for (const handType of handTypesSortedFromBestToWorst) {
      console.log("handType", handType + "");
      const myHand = handType.parse(this._cards, this._name);
      const otherHand = handType.parse(other._cards, other._name);
      if (myHand.doesMatch) {
        if (!otherHand.doesMatch) {
          console.log(`${this._name} has ${handType}, but ${other._name} does not`);
          return true;
        } else if (otherHand.doesMatch) {
          const me = Hand._sortedByNumericValue(myHand.primaryCards);
          const you = Hand._sortedByNumericValue(otherHand.primaryCards);
          for (let i = 0; i < me.length; i++) {
            if (me[i] > you[i]) {
              console.log(`${this._name}.primaryCards (${me}) are better than ${other._name}.primaryCards (${you})`);
              return true;
            }
            if (you[i] > me[i]) {
              console.log(`${other._name}.primaryCards (${you}) are better than ${this._name}.primaryCards (${me})`);
              return false;
            }
          }
        } else {
          const me = Hand._sortedByNumericValue(myHand.remainingCards);
          const you = Hand._sortedByNumericValue(otherHand.remainingCards);
          for (let i = 0; i < me.length; i++) {
            if (me[i] > you[i]) {
              console.log(`${this._name}.remainingCards (${me}) are better than ${other._name}.remainingCards (${you})`);
              return true;
            }
            if (you[i] > me[i]) {
              console.log(`${other._name}.remainingCards (${you}) are better than ${this._name}.remainingCards (${me})`);
              return false;
            }
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