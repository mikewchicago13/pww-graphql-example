import {BookRepository} from "./books/bookRepository";
import {AuthorRepository} from "./books/authorRepository";
import {BowlingAdapter} from "./bowling/bowlingAdapter";
import {Greetings} from "./greetings/greetings";
import {PokerAdapter} from "./poker/pokerAdapter";

export default {
  goodbye: Greetings.goodbye,
  hello: Greetings.hello,
  bookById: BookRepository.bookById,
  authorById: AuthorRepository.authorById,
  bowling: BowlingAdapter.acceptAllRollsAtOnce,
  liveBowling: BowlingAdapter.enableInteractive,
  poker: PokerAdapter.singleHand
};
