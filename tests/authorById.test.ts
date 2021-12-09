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

  it('should have a result', async () => {
    const foo = await fetch("http://localhost:4000/graphql", options);
    const result = await foo.json();
    const actual = JSON.stringify(result);
    console.log(actual);
    const parse = JSON.parse(actual);
    const authorById = parse.data.authorById;
    expect(authorById.id).toBe("author-1");
    expect(authorById.firstName).toContain("first");
    expect(authorById.lastName).toContain("last");
    expect(authorById.books[0].id).toContain("book-");
    expect(authorById.books[0].title).toContain("title ");
    expect(authorById.books[0].pageCount).toBeGreaterThan(0);
  });
});