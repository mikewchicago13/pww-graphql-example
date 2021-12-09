import fetch from 'cross-fetch';

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

  const body = JSON.stringify({
    query
  });
  console.log(body);
  const options = {
    method: "post",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: body
  };

  let authorById: any;
  beforeAll(async () => {
    const response = await fetch("http://localhost:4000/graphql", options);
    const result = await response.json();
    const actual = JSON.stringify(result);
    console.log(actual);
    const parse = JSON.parse(actual);
    authorById = parse.data.authorById;
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