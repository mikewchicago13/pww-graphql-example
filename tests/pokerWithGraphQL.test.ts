import graphqlClient from "./graphqlClient";

describe('can connect to local graphql', () => {
  const query = /* GraphQL */
      `{
          poker ( name: "The Dude", cards: ["AS", "KS", "QS", "JS", "TS" ] ) {
              description
              name
          }
      }`;

  let poker: any;
  let errors: any;
  beforeAll(async () => {
    const json = await graphqlClient({query});
    errors = json.errors;
    poker = json.data.poker;
  })

  it('should not have errors', () => {
    expect(errors).toBeFalsy();
  });

  it('should have description', () => {
    expect(poker.description).toBe("Straight Flush: A high in Spades");
  });
  it('should have name', () => {
    expect(poker.name).toBe("The Dude");
  });
});