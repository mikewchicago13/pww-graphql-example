import fetch from 'cross-fetch';

describe('can connect to local graphql', () => {
  const query = "{ goodbye( name: \"Dude\" ) { contents } }";
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
    expect(actual).toContain("Dude ");
  });
});