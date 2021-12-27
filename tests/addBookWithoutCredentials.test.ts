import {httpGraphqlClient, QueryResult} from "./graphqlClient";

describe('can connect to local graphql', () => {
  const query = /* GraphQL */
      `mutation {
          addBook( title: "a title", pageCount: 7, authorId: "author-1"){
              id
          }
      }`;

  let actual: QueryResult;
  beforeAll(async () => {
    actual = await httpGraphqlClient({query});
  })

  it('should have a result', async () => {
    expect(actual).toBeTruthy();
  });

  it('should have errors', async () => {
    expect(actual.json.errors).toBeTruthy();
  });

  it('should have 401 unauthorized', async () => {
    expect(actual.status).toBe(401);
  });
});