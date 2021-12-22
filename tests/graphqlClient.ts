import fetch from 'cross-fetch';

export default async function graphqlClient(
  {
    query
  }: { query: string },
  additionalHeaders: any = {},
): Promise<any> {
  return httpGraphqlClient({query}, additionalHeaders)
    .then(value => value.json)
}

export interface QueryResult {
  json: any,
  status: number
}

export async function httpGraphqlClient(
  {
    query
  }: { query: string },
  additionalHeaders: any = {}
): Promise<QueryResult> {
  const body = JSON.stringify({
    query
  });
  const response = await fetch(
    "http://localhost:4000/graphql",
    {
      method: "post",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...additionalHeaders
      },
      body: body
    });
  return response
    .json()
    .then(value => {
      return {
        json: value,
        status: response.status
      }
    });
}