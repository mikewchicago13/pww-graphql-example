import {secure} from "./secure";
import {BookRepository} from "./books/bookRepository";

export default {
  addBook: secure(BookRepository.addBook),
};