import {BookRepository} from "./books/bookRepository";
import {AuthorRepository} from "./books/authorRepository";
import {BowlingAdapter} from "./bowling/bowlingAdapter";
import {Greetings} from "./greetings/greetings";
import {Request} from "express";

function secure(func: Function) {
  return (context: unknown, args: unknown, req: Request) => {
    console.log(JSON.stringify(args));
    console.log(req.headers);
    return func(context, args);
  }
}

export default {
  goodbye: Greetings.goodbye,
  hello: Greetings.hello,
  bookById: BookRepository.bookById,
  authorById: AuthorRepository.authorById,
  bowling: BowlingAdapter.acceptAllRollsAtOnce,
  liveBowling: BowlingAdapter.enableInteractive,
  examineRequest: (context: unknown, args: unknown, req: Request) => {
    console.log(context);
    console.log(args);
    return JSON.stringify({
      ip: req.ip,
      headers: req.headers,
      body: req.body
    });
  },
  addBook: secure(BookRepository.addBook)
};
