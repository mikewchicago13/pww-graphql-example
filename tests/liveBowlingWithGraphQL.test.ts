import graphqlClient from "./graphqlClient";
import {ConsoleDisplayFrame} from "./consoleDisplayFrame";

describe('can connect to local graphql', () => {
  const query = /* GraphQL */
      `{
          liveBowling {
              roll0: rollPins(pins: 5) {
                  scoreSheet {
                      frames {
                          ballsThrown
                          runningScore
                      }
                  }
              }
              roll1: rollPins(pins: 5) {
                  scoreSheet {
                      frames {
                          ballsThrown
                          runningScore
                      }
                  }
              }
              roll2: rollPins(pins: 5) {
                  scoreSheet {
                      frames {
                          ballsThrown
                          runningScore
                      }
                  }
              }
          } 
      }`;

  let liveBowling: any;
  let errors: any;
  beforeAll(async () => {
    const json = await graphqlClient({query});
    errors = json.errors;
    liveBowling = json.data.liveBowling;
  })

  it('should not have error', () => {
    expect(errors).toBeFalsy();
  });

  it('should print scoreSheet', () => {
    const rollsTaken = 3;
    for (let i = 0; i < rollsTaken; i++) {
      ConsoleDisplayFrame.print(liveBowling['roll' + i].scoreSheet.frames);
    }
  });
});