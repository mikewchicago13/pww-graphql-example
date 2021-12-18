import graphqlClient from "./graphqlClient";

describe('can connect to local graphql', () => {
  const query = /* GraphQL */
      `{
          bowling ( rolls: [10,10,10,10,10, 10,10,10,10,10, 10,10 ] ) {
              score
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
});