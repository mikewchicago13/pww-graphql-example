import graphqlClient from "./graphqlClient";

describe('can connect to local graphql', () => {
  const query = /* GraphQL */
      `{
          addBook( title: "A Title", pageCount: 7, authorId: "author-1"){
              id
              author {
                  id
                  firstName
                  lastName
              }
          }
      }`;

  let json: any;
  beforeAll(async () => {
    json = await graphqlClient({query}, {authorization: "secret"});
    console.log(json);
  })

  it('should have a result', async () => {
    expect(json).toBeTruthy();
  });

  it('should have id', () => {
    expect(json.data.addBook.id).toBeTruthy();
  });
  it('should have author.id', () => {
    expect(json.data.addBook.author.id).toContain("author-");
  });
  it('should have author.firstName', () => {
    expect(json.data.addBook.author.firstName).toContain("first");
  });
  it('should have author.lastName', () => {
    expect(json.data.addBook.author.lastName).toContain("last");
  });
});