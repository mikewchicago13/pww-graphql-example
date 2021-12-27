import {secure} from "./secure";
import {BookRepository} from "./books/bookRepository";

const mutations: any = {
  addBook: BookRepository.addBook,
};

function secureAllMethods() {
  Object.keys(mutations)
    .forEach(key => mutations[key] = secure(mutations[key]));
}

secureAllMethods();

export default mutations;