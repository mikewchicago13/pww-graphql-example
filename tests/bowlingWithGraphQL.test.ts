import graphqlClient from "./graphqlClient";

class ConsoleDisplayFrame {
  private readonly _runningScore: number;
  private readonly _ballsThrown: string[];
  constructor({runningScore, ballsThrown}: { runningScore: number; ballsThrown: string[] }) {
    this._runningScore = runningScore;
    this._ballsThrown = ballsThrown;
  }

  get line1(): string{
    return (this._ballsThrown[0] + (this._ballsThrown[1] || "")+ (this._ballsThrown[2] || "")).padEnd(3);
  }
  get line2(): string{
    return String(this._runningScore).padEnd(3);
  }
}

describe('can connect to local graphql', () => {
  const query = /* GraphQL */
      `{
          bowling ( rolls: [10,10,10,10,10, 10,10,10,10,10, 10,10 ] ) {
              score
              scoreSheet {
                  frames {
                      ballsThrown
                      runningScore
                  }
              }
          }
      }`;

  let bowling: any;
  let errors: any;
  beforeAll(async () => {
    const json = await graphqlClient({query});
    errors = json.errors;
    bowling = json.data.bowling;
  })

  it('should not have error', () => {
    expect(errors).toBeFalsy();
  });

  it('should have score', () => {
    expect(bowling.score).toBe(300);
  });

  it('should have scoreSheet', () => {
    expect(bowling.scoreSheet.frames).toHaveLength(10);
  });

  it('should print scoreSheet', () => {
    const map: ConsoleDisplayFrame[] = bowling.scoreSheet.frames
      .map(({ballsThrown, runningScore}: {ballsThrown: string[], runningScore: number}) => {
        return new ConsoleDisplayFrame({ballsThrown, runningScore});
      });
    const separator = " | ";
    const line1 = map
      .map(value => value.line1)
      .join(separator)
    const line2 = map
      .map(value => value.line2)
      .join(separator)
    console.log(line1 + '\n' + line2)
  });
});