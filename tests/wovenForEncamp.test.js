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
  it('should have url', () => {
    expect(actual.url).toContain(path);
  });
  it('should have query string contents', () => {
    expect(actual.queryParams.queryParam1).toBe("queryVal1");
  });

  describe('should have body contents', () => {
    it('key1', () => {
      expect(actual.body.key1).toBe("val1");
    });
    it('key2', () => {
      expect(actual.body.key2).toBe("val2");
    });
  });

  describe('should have headers', () => {
    it('Accept', () => {
      expect(actual.headers.accept).toBe("application/json");
    });
    it('Content-Type', () => {
      expect(actual.headers['content-type']).toBe("application/json");
    });
  });

  describe('should have default values', () => {
    it('mode', () => {
      expect(actual.mode).toBe("cors");
    });
    it('credentials', () => {
      expect(actual.credentials).toBe("same-origin");
    });
    it('cache', () => {
      expect(actual.cache).toBe("default");
    });
    it('redirect', () => {
      expect(actual.redirect).toBe("manual");
    });
  });
});
