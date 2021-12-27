import graphqlClient from "./graphqlClient";

describe('can connect to local graphql', () => {
  const query = /* GraphQL */
      `mutation {
          addBook( title: "A Title", pageCount: 7, authorId: "author-1"){
              id
              author {
                  id
                  firstName
                  lastName
              }
          }
      }`;

  let addBook: any;
  let errors: any;
  beforeAll(async () => {
    const json = await graphqlClient({query}, {authorization: "secret"});
    errors = json.errors;
    addBook = json.data.addBook;
  })
  it('should not have errors', () => {
    expect(errors).toBeFalsy();
  });
  it('should have id', () => {
    expect(addBook.id).toBeTruthy();
  });
  it('should have author.id', () => {
    expect(addBook.author.id).toContain("author-");
  });
  it('should have author.firstName', () => {
    expect(addBook.author.firstName).toContain("first");
  });
  it('should have author.lastName', () => {
    expect(addBook.author.lastName).toContain("last");
  });

  it('should be retrievable later', async () => {
    const query2 = /* GraphQL */
        `{
            bookById(id: "${addBook.id}"){
                id
            }
        }`;
    const json = await graphqlClient({query: query2});
    expect(json.data.bookById.id).toBe(addBook.id);
  });
});