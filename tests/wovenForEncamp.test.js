import {wovenForEncamp} from "../wovenForEncamp";

// assuming you've run the below to mock web requests
// npm install --save-dev msw
import {rest} from 'msw';
import {setupServer} from 'msw/node';

const path = "https://httpbin.org/post";
const server = setupServer(
  rest.post(path,
    (req,
     res,
     ctx) => {
      const queryParams = {};
      req.url.searchParams.forEach((value, key) => {
        queryParams[key] = value;
      });
      const body = req.body || {};
      const response = {
        queryParams,
        body
      };
      return res(ctx.json(response));
    }),
)
let actual;
beforeAll(async () => {
  server.listen();
  actual = await wovenForEncamp(path);
})
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('woven for encamp', () => {
  it('should do something', async () => {
    expect(actual).toBeTruthy();
  });
  it('should have query string contents', () => {
    expect(actual.queryParams.queryParam1).toBe("queryVal1");
  });
  it('should have body contents: key1', () => {
    expect(actual.body.key1).toBe("val1");
  });
  it('should have body contents: key2', () => {
    expect(actual.body.key2).toBe("val2");
  });
});
