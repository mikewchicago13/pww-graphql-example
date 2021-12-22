import graphqlClient from "./graphqlClient";

describe('can connect to local graphql', () => {
  const query = /* GraphQL */
      `{
          addBook( title: "a title", pageCount: 7, authorId: "author-1"){
              id
          }
      }`;

  let json: any;
  beforeAll(async () => {
    json = await graphqlClient({query});
    console.log(json);
  })

  it('should have a result', async () => {
    expect(json).toBeTruthy();
  });

  it('should have errors', async () => {
    expect(json.errors).toBeTruthy();
  });
});