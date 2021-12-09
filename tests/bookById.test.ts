import fetch from 'cross-fetch';

describe('can connect to local graphql', () => {
  const query = `{
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
  let bookById: any;
  beforeAll(async () => {
    const response = await fetch("http://localhost:4000/graphql", options);
    const result = await response.json();
    const actual = JSON.stringify(result);
    console.log(actual);
    const parse = JSON.parse(actual);
    bookById = parse.data.bookById;
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
  it('should have author.lastName',  () => {
    expect(bookById.author.lastName).toContain("last");
  });
});