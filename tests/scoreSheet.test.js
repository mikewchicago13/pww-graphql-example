import bowling from "../graphql/bowling";

describe('scoreSheet', () => {
  describe('no balls thrown yet', () => {
    it('should have ten frames', () => {
      expect(bowling().scoreSheet.frames).toHaveLength(10);
    });
    for (let i = 0; i < 9; i++) {
      it('frame ' + (i + 1) + ' should have zero balls thrown', () => {
        expect(bowling().scoreSheet.frames[i].marks).toStrictEqual([undefined, undefined]);
      });
      it('frame ' + (i + 1) + ' should have running score of undefined', () => {
        expect(bowling().scoreSheet.frames[i].runningScore).toBeUndefined();
      });
    }

    it('frame 10 should have three undefined balls thrown', () => {
      expect(bowling().scoreSheet.frames[9].marks).toStrictEqual([undefined, undefined, undefined]);
    });
    it('frame 10 should have running score of undefined', () => {
      expect(bowling().scoreSheet.frames[9].runningScore).toBeUndefined();
    });
  });

  describe('all zeros', () => {
    let game = bowling();
    for (let i = 0; i < 20; i++) {
      game = game.roll(0);
    }
    for (let i = 0; i < 9; i++) {
      it('frame ' + (i + 1) + ' should have two balls thrown', () => {
        expect(game.scoreSheet.frames[i].marks).toStrictEqual(["-", "-"]);
      });
      it('frame ' + (i + 1) + ' should have running score of 0', () => {
        expect(game.scoreSheet.frames[i].runningScore).toBe(0);
      });
    }

    it('frame 10 should have two balls thrown', () => {
      expect(game.scoreSheet.frames[9].marks).toStrictEqual(["-", "-", undefined]);
    });
    it('frame 10 should have running score of 0', () => {
      expect(game.scoreSheet.frames[9].runningScore).toBe(0);
    });
  });

  describe('perfect game', () => {
    function perfectGame() {
      let game = bowling();
      for (let i = 0; i < 12; i++) {
        game = game.roll(10);
      }
      return game;
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

    for (let i = 0; i < 9; i++) {
      it('frame ' + (i + 1) + ' should have one strike and empty fill', () => {
        expect(perfectGame().scoreSheet.frames[i].marks).toStrictEqual(["X", undefined]);
      });
      it('frame ' + (i + 1) + ' should have running score of 30 per frame', () => {
        expect(perfectGame().scoreSheet.frames[i].runningScore).toBe((i + 1) * 30);
      });
    }

    it('frame 10 should have three strikes', () => {
      expect(perfectGame().scoreSheet.frames[9].marks).toStrictEqual(["X", "X", "X"]);
    });
    it('frame 10 should have running score of 300', () => {
      expect(perfectGame().scoreSheet.frames[9].runningScore).toBe(300);
    });
  });

  describe('first frame strike', () => {
    it('frame 1 should have running score of undefined because frame is not done counting', () => {
      expect(bowling().roll(10).scoreSheet.frames[0].runningScore).toBeUndefined();
    });
    it('frame 1 should have running score of undefined because frame is not done counting', () => {
      expect(bowling().roll(10).roll(5).scoreSheet.frames[0].runningScore).toBeUndefined();
    });
    it('frame 1 should have running score of 18 because frame is done counting', () => {
      expect(bowling().roll(10).roll(5).roll(3).scoreSheet.frames[0].runningScore)
        .toBe(18);
    });
  });

  describe('first frame spare', () => {
    it('frame 1 should have one strike and empty fill', () => {
      expect(bowling().roll(0).roll(10).scoreSheet.frames[0].marks).toStrictEqual(["-", "/"]);
    });
    it('frame 1 should have running score of undefined because frame is not done counting', () => {
      expect(bowling().roll(0).roll(10).scoreSheet.frames[0].runningScore).toBeUndefined();
    });
    it('frame 1 should have running score of 17 because frame is done counting', () => {
      expect(bowling().roll(0).roll(10).roll(7).scoreSheet.frames[0].runningScore).toBe(17);
    });
  });

  describe('first frame open', () => {
    it('frame 1 should have running score of 9 because frame is done counting', () => {
      expect(bowling().roll(5).roll(4).scoreSheet.frames[0].runningScore).toBe(9);
    });
  });

  describe('all 5s, i.e. all spares and fill ball', () => {
    function allFives() {
      let game = bowling();
      for (let i = 0; i < 21; i++) {
        game = game.roll(5);
      }
      return game;
    }

    for (let i = 0; i < 9; i++) {
      it('frame ' + (i + 1) + ' should have "5 /"', () => {
        expect(allFives().scoreSheet.frames[i].marks).toStrictEqual(["5", "/"]);
      });
      it('frame ' + (i + 1) + ' should have running score of 15 per frame', () => {
        expect(allFives().scoreSheet.frames[i].runningScore).toBe((i + 1) * 15);
      });
    }

    it('frame 10 should have "5 / 5"', () => {
      expect(allFives().scoreSheet.frames[9].marks).toStrictEqual(["5", "/", "5"]);
    });
    it('frame 10 should have running score of 150', () => {
      expect(allFives().scoreSheet.frames[9].runningScore).toBe(150);
    });
  });

  describe('spare on fill ball in the tenth', () => {
    function eighteenGutters() {
      let game = bowling();
      for (let i = 0; i < 18; i++) {
        game = game.roll(0);
      }
      return game;
    }

    it('frame 10 should have be undefined because not done counting', () => {
      expect(eighteenGutters().roll(10).scoreSheet.frames[9].runningScore).toBeUndefined();
    });
    it('frame 10 should have be undefined because not done counting', () => {
      expect(eighteenGutters().roll(10).roll(5).scoreSheet.frames[9].runningScore).toBeUndefined();
    });
    it('frame 10 should have be 20 because done counting', () => {
      expect(eighteenGutters().roll(10).roll(5).roll(5).scoreSheet.frames[9].runningScore)
        .toBe(20);
    });
    it('frame 10 should have "X 5 /"', () => {
      expect(eighteenGutters().roll(10).roll(5).roll(5).scoreSheet.frames[9].marks)
        .toStrictEqual(["X", "5", "/"]);
    });

  });
});

