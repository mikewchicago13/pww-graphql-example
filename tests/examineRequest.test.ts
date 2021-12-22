import graphqlClient from "./graphqlClient";

describe('can connect to local graphql', () => {
  const query = /* GraphQL */
      `{
          examineRequest
      }`;

  let examineRequest: any;
  beforeAll(async () => {
    const json = await graphqlClient({query});
    console.log(json);
    examineRequest = json.data.examineRequest;
  })

  it('should have a result', async () => {
    expect(examineRequest).toBeTruthy();
  });
});