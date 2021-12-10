import graphqlClient from "./graphqlClient";

describe('can connect to local graphql', () => {
  const query = /* GraphQL */
      `{
          bookById(id: "book-1"){
              id
              title
              pageCount
              author {
                  firstName
                  lastName
              }
          }
      }`;

  let bookById: any;
  beforeAll(async () => {
    const json = await graphqlClient({query});
    bookById = json.data.bookById;
  });

  it('should have id', () => {
    expect(bookById.id).toBe("book-1");
  });
  it('should have title', () => {
    expect(bookById.title).toContain("title");
  });
  it('should have pageCount', () => {
    expect(bookById.pageCount).toBeGreaterThanOrEqual(0);
  });
  it('should have author.firstName', () => {
    expect(bookById.author.firstName).toContain("first");
  });
  it('should have author.lastName', () => {
    expect(bookById.author.lastName).toContain("last");
  });
});