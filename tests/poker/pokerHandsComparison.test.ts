import {PokerHandsInput} from "../../graphql/poker/pokerHandsComparison";

describe('poker hands comparison', () => {
  describe('parse input', () => {
    const comparison = new PokerHandsInput().parse("Black: 2H 3D 5S 9C KD  White: 2C 3H 4S 8C AH");
    it('should have black hand', () => {
      expect(comparison.one + "").toBe("2H 3D 5S 9C KD");
    });
    it('should have white hand', () => {
      expect(comparison.two + "").toBe("2C 3H 4S 8C AH");
    });
  });

  describe('choose a winner', () => {
    describe('simple high card', () => {
      it('White', () => {
        const comparison = new PokerHandsInput().parse("Black: 2H 3D 5S 9C KD  White: 2C 3H 4S 8C AH");
        expect(comparison + "").toMatch(/White/);
      });
      it('Black', () => {
        const comparison = new PokerHandsInput().parse("Black: 2C 3H 4S 8C AH  White: 2H 3D 5S 9C KD");
        expect(comparison + "").toMatch(/Black/);
      });
      it('Tie', () => {
        const comparison = new PokerHandsInput().parse("Black: 2C 3H 4S 8C AH  White: 2S 3C 4H 8S AD");
        expect(comparison + "").toMatch(/Tie/);
      });
    });
    describe('high card same, need second highest', () => {
      it('White', () => {
        const comparison = new PokerHandsInput().parse("Black: 2H 3D 5S 9C AD  White: 2C 3H 4S TC AH");
        expect(comparison + "").toMatch(/White/);
      });
      it('Black', () => {
        const comparison = new PokerHandsInput().parse("Black: 2C 3H 4S TC AH  White: 2H 3D 5S 9C AD");
        expect(comparison + "").toMatch(/Black/);
      });
    });
  });

  describe('describe winning hand', () => {

  });
});