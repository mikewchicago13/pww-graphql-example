import bowling from "../graphql/bowling";

const FRAMES = 10;
describe('scoreSheet', () => {
  describe('no balls thrown yet', () => {
    const actual = bowling().scoreSheet;
    it('should have ten frames', () => {
      expect(actual.frames).toHaveLength(FRAMES);
    });
    for (let i = 0; i < FRAMES; i++) {
      it('frame ' + i + ' should have zero balls thrown', () => {
        expect(actual.frames[i].ballsThrown).toHaveLength(0);
      });
    }
  });
});