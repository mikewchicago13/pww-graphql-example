import graphqlClient from "./graphqlClient";

describe('can connect to local graphql', () => {
  const query = /* GraphQL */
      `{
          hello {
              contents
          }
      }`;

  let hello: any;
  beforeAll(async () => {
    const json = await graphqlClient({query});
    hello = json.data.hello;
  })

  it('should have a result', async () => {
    expect(hello.contents).toContain("Hello ");
  });
});