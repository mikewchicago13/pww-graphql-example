import graphqlClient from "./graphqlClient";
import {ConsoleDisplayFrame} from "./consoleDisplayFrame";

describe('can connect to local graphql', () => {
  const rollsTaken = 21;

  function concatenateRolls() {
    return new Array(rollsTaken).fill(1)
      .map((_, index) => {
        return `
              roll${index}: rollPins(pins: 5) {
                  score
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

  it('should not have errors', () => {
    expect(errors).toBeFalsy();
  });

  const rolls = new Array(rollsTaken).fill(1).map((_, index) => index);
  it.each(rolls)
  ('should print scoreSheets for each roll %s', (i) => {
    ConsoleDisplayFrame.print(liveBowling['roll' + i].scoreSheet.frames);
  });

  it.each([
    [0, 5],
    [1, 10],
    [20, 150],
  ])
  ('should keep accumulating score %s', (i, expectedScore) => {
    expect(liveBowling['roll' + i].score).toBe(expectedScore)
  });
});