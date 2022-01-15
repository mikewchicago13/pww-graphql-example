import bowlingGame from "../../graphql/bowling/bowlingGame";
import {IGame} from "../../graphql/bowling/bowlingUtilities";

describe('scoreSheet', () => {
  describe('no balls thrown yet', () => {
    it('should have ten frames', () => {
      expect(bowlingGame().scoreSheet.frames).toHaveLength(10);
    });
    describe.each(arrayWithLengthAndIndexAsValue(9))('first 9 frames', (i) => {
      it('frame ' + (i + 1) + ' should have zero balls thrown', () => {
        expect(bowlingGame().scoreSheet.frames[i].marks).toStrictEqual([undefined, undefined]);
      });
      it('frame ' + (i + 1) + ' should have running score of undefined', () => {
        expect(bowlingGame().scoreSheet.frames[i].runningScore).toBeUndefined();
      });
    });

    it('frame 10 should have three undefined balls thrown', () => {
      expect(bowlingGame().scoreSheet.frames[9].marks).toStrictEqual([undefined, undefined, undefined]);
    });
    it('frame 10 should have running score of undefined', () => {
      expect(bowlingGame().scoreSheet.frames[9].runningScore).toBeUndefined();
    });
  });

  describe('all zeros', () => {
    const game = new Array(20).fill(1)
      .reduce((g: IGame) => g.roll(0), bowlingGame())
    describe.each(arrayWithLengthAndIndexAsValue(9))('first 9 frames', (i) => {
      it('frame ' + (i + 1) + ' should have two balls thrown', () => {
        expect(game.scoreSheet.frames[i].marks).toStrictEqual(["-", "-"]);
      });
      it('frame ' + (i + 1) + ' should have running score of 0', () => {
        expect(game.scoreSheet.frames[i].runningScore).toBe(0);
      });
    })

    it('frame 10 should have two balls thrown', () => {
      expect(game.scoreSheet.frames[9].marks).toStrictEqual(["-", "-", undefined]);
    });
    it('frame 10 should have running score of 0', () => {
      expect(game.scoreSheet.frames[9].runningScore).toBe(0);
    });
  });

  describe('perfect game', () => {
    function perfectGame(): IGame {
      return new Array(12).fill(1)
        .reduce((g: IGame) => g.roll(10), bowlingGame())
    }

    it('frame 1 should have running score of 30 per frame', () => {
      expect(perfectGame().scoreSheet.frames[0].runningScore).toBe(30);
    });
    it('frame 2 should have running score of 30 per frame', () => {
      expect(perfectGame().scoreSheet.frames[1].runningScore).toBe(60);
    });
    it('frame 9 should have running score of 30 per frame', () => {
      expect(perfectGame().scoreSheet.frames[8].runningScore).toBe(270);
    });

    describe.each(arrayWithLengthAndIndexAsValue(9))('first 9 frames', (i) => {
      it('frame ' + (i + 1) + ' should have one strike and empty fill', () => {
        expect(perfectGame().scoreSheet.frames[i].marks).toStrictEqual(["X", undefined]);
      });
      it('frame ' + (i + 1) + ' should have running score of 30 per frame', () => {
        expect(perfectGame().scoreSheet.frames[i].runningScore).toBe((i + 1) * 30);
      });
    })

    it('frame 10 should have three strikes', () => {
      expect(perfectGame().scoreSheet.frames[9].marks).toStrictEqual(["X", "X", "X"]);
    });
    it('frame 10 should have running score of 300', () => {
      expect(perfectGame().scoreSheet.frames[9].runningScore).toBe(300);
    });
  });

  describe('first frame strike', () => {
    it('frame 1 should have running score of undefined because frame is not done counting', () => {
      expect(bowlingGame().roll(10).scoreSheet.frames[0].runningScore).toBeUndefined();
    });
    it('frame 1 should have running score of undefined because frame is not done counting', () => {
      expect(bowlingGame().roll(10).roll(5).scoreSheet.frames[0].runningScore).toBeUndefined();
    });
    it('frame 1 should have running score of 18 because frame is done counting', () => {
      expect(bowlingGame().roll(10).roll(5).roll(3).scoreSheet.frames[0].runningScore)
        .toBe(18);
    });
  });

  describe('first frame spare', () => {
    it('frame 1 should have one strike and empty fill', () => {
      expect(bowlingGame().roll(0).roll(10).scoreSheet.frames[0].marks).toStrictEqual(["-", "/"]);
    });
    it('frame 1 should have running score of undefined because frame is not done counting', () => {
      expect(bowlingGame().roll(0).roll(10).scoreSheet.frames[0].runningScore).toBeUndefined();
    });
    it('frame 1 should have running score of 17 because frame is done counting', () => {
      expect(bowlingGame().roll(0).roll(10).roll(7).scoreSheet.frames[0].runningScore).toBe(17);
    });
  });

  describe('first frame open', () => {
    it('frame 1 should have running score of 9 because frame is done counting', () => {
      expect(bowlingGame().roll(5).roll(4).scoreSheet.frames[0].runningScore).toBe(9);
    });
  });

  describe('all 5s, i.e. all spares and fill ball', () => {
    function allFives(): IGame {
      return new Array(21).fill(1)
        .reduce((g: IGame) => g.roll(5), bowlingGame())
    }

    describe.each(arrayWithLengthAndIndexAsValue(9))('first 9 frames', (i) => {
      it('frame ' + (i + 1) + ' should have "5 /"', () => {
        expect(allFives().scoreSheet.frames[i].marks).toStrictEqual(["5", "/"]);
      });
      it('frame ' + (i + 1) + ' should have running score of 15 per frame', () => {
        expect(allFives().scoreSheet.frames[i].runningScore).toBe((i + 1) * 15);
      });
    })

    it('frame 10 should have "5 / 5"', () => {
      expect(allFives().scoreSheet.frames[9].marks).toStrictEqual(["5", "/", "5"]);
    });
    it('frame 10 should have running score of 150', () => {
      expect(allFives().scoreSheet.frames[9].runningScore).toBe(150);
    });
  });

  describe('spare on fill ball in the tenth', () => {
    function eighteenGutters(): IGame {
      return new Array(18).fill(1)
        .reduce((g: IGame) => g.roll(0), bowlingGame())
    }

    it('ball 1 should have be undefined because not done counting', () => {
      expect(eighteenGutters().roll(10).scoreSheet.frames[9].runningScore).toBeUndefined();
    });
    it('ball 2 should have be undefined because not done counting', () => {
      expect(eighteenGutters().roll(10).roll(5).scoreSheet.frames[9].runningScore).toBeUndefined();
    });
    it('ball 3 should have be 20 because done counting', () => {
      expect(eighteenGutters().roll(10).roll(5).roll(5).scoreSheet.frames[9].runningScore)
        .toBe(20);
    });
    it('marks should have "X 5 /"', () => {
      expect(eighteenGutters().roll(10).roll(5).roll(5).scoreSheet.frames[9].marks)
        .toStrictEqual(["X", "5", "/"]);
    });

  });
});

function arrayWithLengthAndIndexAsValue(n: number): number[] {
  return new Array(n).fill(1)
    .map((_, index) => index);
}

