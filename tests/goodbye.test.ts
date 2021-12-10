import graphqlClient from "./graphqlClient";

describe('can connect to local graphql', () => {
  const query = /* GraphQL */
      `{
          goodbye( name: "Dude" ) {
              contents
          }
      }`;

  let goodbye: any;
  beforeAll(async () => {
    const json = await graphqlClient({query});
    goodbye = json.data.goodbye;
  })

  it('should have a result', () => {
    expect(goodbye.contents).toContain("Dude ");
  });
});