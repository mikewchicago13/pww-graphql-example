import Response from "./response";
import {BookRepository} from "./books/bookRepository";
import {AuthorRepository} from "./books/authorRepository";
import {BowlingAdapter} from "./bowlingAdapter";

export default {
  goodbye: (
    _: unknown,
    {name}: { name: string }
  ): Response => {
    console.log("INSIDE_GOODBYE " + name);
    return new Response('Goodbye ' + name + ' ' + new Date() + '!');
  },
  hello: (): Response => {
    console.log("INSIDE_HELLO");
    return new Response('Hello world ' + new Date() + '!');
  },
  bookById: new BookRepository().bookById(),
  authorById: new AuthorRepository().authorById(),
  bowling: new BowlingAdapter().acceptAllRollsAtOnce(),
  liveBowling: new BowlingAdapter().enableInteractive()
};
