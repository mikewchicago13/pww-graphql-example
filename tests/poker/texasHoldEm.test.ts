import {TexasHoldEm, TexasHoldEmHand} from "../../graphql/poker/texasHoldEm";
import {EOL} from "os";

describe("texas hold 'em", () => {
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

  it('should split by line', () => {
    expect(TexasHoldEm.parse(input)).toHaveLength(6);
  });
  const actual = TexasHoldEm.toOutput(input).split(EOL);
  expected.split(EOL)
    .map(x => x.trim())
    .forEach((value, index) => {
      it(`${index} should match output`, () => {
        expect(actual[index]).toBe(value);
      });
    })

  describe('create all possible hands', () => {
    const cards = "AD 2D 3D 4D 5D 6D 7D";
    it('should have 7 choose 5 = 21 possible hands', () => {
      expect(new TexasHoldEmHand(cards).allPossibleHands).toHaveLength(21);
    });
    it('should have 21 distinct hands', () => {
      const uniqueHands = new TexasHoldEmHand(cards).allPossibleHands
        .map(value => value.rawCards + "")
        .filter(function (value, index, self) {
          return self.indexOf(value) === index;
        });
      expect(uniqueHands).toHaveLength(21);
    });
    new TexasHoldEmHand(cards).allPossibleHands.forEach(value => {
      it(`${value.rawCards} ${value.description}`, () => {
        expect(value.rawCards.length).toBe(5);
      });
      it(`${value}`, () => {
        expect(value).toBeTruthy();
      });
    })

    it('should choose the best hand', () => {
      expect(new TexasHoldEmHand(cards).description).toMatch(/Straight Flush: 7 high in Diamonds/);
    });
  });
});