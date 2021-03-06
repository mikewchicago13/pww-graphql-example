import graphqlClient from "./graphqlClient";
import { v4 as uuidv4 } from 'uuid';

describe('can connect to local graphql', () => {
  const madeUpId = uuidv4();
  const query = /* GraphQL */
      `{
          bookById(id: "${madeUpId}"){
              id
          }
      }`;
  let errors: any;
  beforeAll(async () => {
    const json = await graphqlClient({query});
    errors = json.errors;
  })

  it('should have errors', async () => {
    expect(errors).toBeTruthy();
  });
});