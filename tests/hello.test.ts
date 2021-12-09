import fetch from 'cross-fetch';

describe('can connect to local graphql', async () => {
  const query = "query {hello}";
  const options = {
    method: "post",
    body: query
  };
  const foo = await fetch("http://localhost:4000/graphql", options);
  const result = await foo.json();
  it('should have a result', () => {
    expect(result).toContain("Hello");
  });
});