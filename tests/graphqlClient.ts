import fetch from 'cross-fetch';

export default async function graphqlClient(
  {
    query
  }:
    {
      query: string
    }
): Promise<any> {
  const body = JSON.stringify({
    query
  });
  console.log(body);
  const response = await fetch(
    "http://localhost:4000/graphql",
    {
      method: "post",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: body
    });
  const result = await response.json();
  console.log(JSON.stringify(result, undefined, " "));
  return result;
}