interface Hand {

}

interface Comparison {
  black: Hand
}

export class PokerHandsInput {
  parse(input: string): Comparison {
    return {
      black: {}
    };
  }
}