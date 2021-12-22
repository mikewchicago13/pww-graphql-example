import graphqlClient from "./graphqlClient";

describe('can connect to local graphql', () => {
  const query = /* GraphQL */
      `{
          examineRequest
      }`;

  let json: any;
  beforeAll(async () => {
    json = await graphqlClient({query});
    console.log(json);
  })

  it('should have a result', async () => {
    expect(json).toBeTruthy();
  });
});