import {BookRepository} from "./books/bookRepository";
import {AuthorRepository} from "./books/authorRepository";
import {BowlingAdapter} from "./bowlingAdapter";
import {Greetings} from "./greetings/greetings";

export default {
  goodbye: Greetings.goodbye,
  hello: Greetings.hello,
  bookById: new BookRepository().bookById(),
  authorById: new AuthorRepository().authorById(),
  bowling: new BowlingAdapter().acceptAllRollsAtOnce(),
  liveBowling: new BowlingAdapter().enableInteractive()
};
