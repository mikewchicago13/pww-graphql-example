import graphqlClient from "./graphqlClient";
import {ConsoleDisplayFrame} from "./consoleDisplayFrame";

describe('can connect to local graphql', () => {
  const rollsTaken = 21;

  function concatenateRolls() {
    return new Array(rollsTaken).fill(1)
      .map((_, index) => {
        return `
              roll${index}: rollPins(pins: 5) {
                  scoreSheet {
                      frames {
                          marks
                          runningScore
                      }
                  }
              }`;
      })
      .join();
  }

  const query =
      `{
          liveBowling {` +
    concatenateRolls() +
    `
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

  it('should print scoreSheets for each roll', () => {
    for (let i = 0; i < rollsTaken; i++) {
      ConsoleDisplayFrame.print(liveBowling['roll' + i].scoreSheet.frames);
    }
  });
});