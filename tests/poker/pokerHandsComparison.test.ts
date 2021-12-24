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

    describe('pair vs high card', () => {
      it('White has pair of 2s, Black has higher high card', () => {
        const comparison = new PokerHandsInput().parse("Black: 2H 3D 5S 9C KD  White: 2C 2S 4S 8C QH");
        expect(comparison + "").toMatch(/White/);
      });
      it('Tie', () => {
        const comparison = new PokerHandsInput().parse("Black: 2C 2H 4S 8C AH  White: 2S 2D 4H 8S AD");
        expect(comparison + "").toMatch(/Tie/);
      });
    });

    describe('same pair', () => {
      it('Both have pair of 2s, White has higher last card', () => {
        const comparison = new PokerHandsInput().parse("Black: 2H 2D 3S 8S KD  White: 2C 2S 4S 8C KH");
        expect(comparison + "").toMatch(/White/);
      });
      it('Tie', () => {
        const comparison = new PokerHandsInput().parse("Black: 2H 2D 4C 8S KD  White: 2C 2S 4S 8C KH");
        expect(comparison + "").toMatch(/Tie/);
      });
    });

    describe('different pair', () => {
      it('Black has higher pair', () => {
        const comparison = new PokerHandsInput().parse("Black: 5H 5D 4C 8S KD  White: 3C 3S 4S 8C KH");
        expect(comparison + "").toMatch(/Black/);
      });
    });
  });

  describe('describe winning hand', () => {

  });
});