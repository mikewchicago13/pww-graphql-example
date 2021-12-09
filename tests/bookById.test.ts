import fetch from 'cross-fetch';

describe('can connect to local graphql', () => {
  const query = `{
    bookById(id: "book-1"){
        id
        title
        pageCount
    }
}`;

  // author {
  //   firstName
  //   lastName
  // }
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
    const bookById = parse.data.bookById;
    expect(bookById.id).toBe("book-1");
    expect(bookById.title).toContain("title");
    expect(bookById.pageCount).toBeGreaterThanOrEqual(0);
    // expect(bookById.author.firstName).toContain("first");
    // expect(bookById.author.lastName).toContain("last");
  });
});