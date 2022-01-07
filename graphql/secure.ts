import {Request} from "express";

export function secure(func: Function) {
  return (context: unknown, args: unknown, req: Request) => {
    if (req.headers.authorization === 'secret') {
      return func(context, args, req);
    }
    if (req && req.res) {
      req.res.status(401);
      throw new Error("Unauthorized");
    }
    throw new Error("invalid parameters");
  }
}