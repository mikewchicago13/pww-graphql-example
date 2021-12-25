import {TexasHoldEm} from "../../graphql/poker/texasHoldEm";
import {EOL} from "os";
import {TexasHoldEmHand} from "../../graphql/poker/texasHoldEmHand";

describe("texas hold 'em", () => {
  describe('one winner', () => {
    const input = `KC 9S KS KD 9D 3C 6D
  9C AH KS KD 9D 3C 6D
  AC QC KS KD 9D 3C
  9H 5S
  4D 2D KS KD 9D 3C 6D
  7S TS KS KD 9D`;

    const expected = `KC 9S KS KD 9D 3C 6D Full House: Ks over 9s (winner)
9C AH KS KD 9D 3C 6D Two Pairs: Ks and 9s
AC QC KS KD 9D 3C 
9H 5S 
4D 2D KS KD 9D 3C 6D Flush: K high in Diamonds
7S TS KS KD 9D`
    const actual = String(new TexasHoldEm(input)).split(EOL);
    expected.split(EOL)
      .map(x => x.trim())
      .forEach((value, index) => {
        it(`${index} should match output`, () => {
          expect(actual[index]).toBe(value);
        });
      })
  });

  describe('more than one winner', () => {
    const input = `AH 2C 4D 5S 6H 8D 9S
  AD 3S 4D 5S 6H 8D 9S
  2H 3H 4D 5S 7H 8D 9S`;

    const expected = `AH 2C 4D 5S 6H 8D 9S High Card: A (winner)
  AD 3S 4D 5S 6H 8D 9S High Card: A (winner)
  2H 3H 4D 5S 7H 8D 9S High Card: 9`

    const actual = String(new TexasHoldEm(input)).split(EOL);
    expected.split(EOL)
      .map(x => x.trim())
      .forEach((value, index) => {
        it(`${index} should match output`, () => {
          expect(actual[index]).toBe(value);
        });
      })
  });

  describe('create all possible hands', () => {
    const cards = "AD 2D 3D 4D 5D 6D 7D";
    it('should have 7 choose 5 = 21 possible hands', () => {
      expect(new TexasHoldEmHand(cards).handsFromBestToWorst).toHaveLength(21);
    });
    it('should have 21 distinct hands', () => {
      const uniqueHands = new TexasHoldEmHand(cards).handsFromBestToWorst
        .map(value => value + "")
        .filter(function (value, index, self) {
          return self.indexOf(value) === index;
        });
      expect(uniqueHands).toHaveLength(21);
    });

    it('should choose the best hand', () => {
      expect(new TexasHoldEmHand(cards).description).toMatch(/Straight Flush: 7 high in Diamonds/);
    });
  });
});