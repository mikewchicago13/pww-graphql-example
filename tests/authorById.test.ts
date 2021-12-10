import graphqlClient from "./graphqlClient";

describe('can connect to local graphql', () => {
  const query = `{
    authorById(id: "author-1"){
        id
        firstName
        lastName
        books { 
          id
          title
          pageCount
        }
    }
}`;

  let authorById: any;
  beforeAll(async () => {
    const json = await graphqlClient({query});
    authorById = json.data.authorById;
  })

  it('should have id', () => {
    expect(authorById.id).toBe("author-1");
  });
  it('should have firstName', () => {
    expect(authorById.firstName).toContain("first");
  });
  it('should have lastName', () => {
    expect(authorById.lastName).toContain("last");
  });
  it('should have books with id', () => {
    expect(authorById.books[0].id).toContain("book-");
  });
  it('should have books with title', () => {
    expect(authorById.books[0].title).toContain("title ");
  });
  it('should have books with pageCount',  () => {
    expect(authorById.books[0].pageCount).toBeGreaterThan(0);
  });
});