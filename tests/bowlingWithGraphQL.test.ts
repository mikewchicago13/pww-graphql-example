import graphqlClient from "./graphqlClient";
import {ConsoleDisplayFrame} from "./consoleDisplayFrame";

describe('can connect to local graphql', () => {
  const query = /* GraphQL */
      `{
          bowling ( rolls: [10,10,10,10,10, 10,10,10,10,10, 10,10 ] ) {
              score
              scoreSheet {
                  frames {
                      marks
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
    ConsoleDisplayFrame.print(bowling.scoreSheet.frames)
  });
});