import graphqlClient from "./graphqlClient";

describe('can connect to local graphql',  () => {
  const query = "{ junk }";
  let errors: any;
  beforeAll(async () => {
    const json = await graphqlClient({query});
    errors = json.errors;
  })

  it('should have a result', async () => {
    expect(errors).toBeTruthy();
  });
});