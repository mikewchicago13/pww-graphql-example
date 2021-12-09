import Response from "./response";
import bookById from "./bookById";

export default function getRootValue() {
  return {
    goodbye: ({name}: { name: string }): Response => {
      console.log("INSIDE_GOODBYE " + name);
      return new Response('Goodbye ' + name + ' ' + new Date() + '!');
    },
    hello: (): Response => {
      console.log("INSIDE_HELLO");
      return new Response('Hello world ' + new Date() + '!');
    },
    bookById: bookById()
  };
}