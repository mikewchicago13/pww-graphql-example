// wovenForEncamp.test.js
//
// assuming you've run the below to mock web requests
// npm install --save-dev msw

import {wovenForEncamp} from "../wovenForEncamp";
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
      const response = {
        queryParams,
        body: req.body,
        headers: req.headers.raw(),
        url: req.url,
        mode: req.mode,
        credentials: req.credentials,
        cache: req.cache,
        redirect: req.redirect
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
  it('should have url', () => {
    expect(actual.url).toContain(path);
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

  it('should have headers: Accept', () => {
    expect(actual.headers.accept).toBe("application/json");
  });
  it('should have headers: Content-Type', () => {
    expect(actual.headers['content-type']).toBe("application/json");
  });

  it('should default value for mode', () => {
    expect(actual.mode).toBe("cors");
  });
  it('should default value for credentials', () => {
    expect(actual.credentials).toBe("same-origin");
  });
  it('should default value for cache', () => {
    expect(actual.cache).toBe("default");
  });
  it('should default value for redirect', () => {
    expect(actual.redirect).toBe("manual");
  });
});
