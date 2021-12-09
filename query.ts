import Response from "./response";
import bookById from "./bookById";

export default {
  goodbye: (
    _: unknown,
    {name}: { name: string }
  ): Response => {
    console.log("INSIDE_GOODBYE " + _ + name);
    return new Response('Goodbye ' + name + ' ' + new Date() + '!');
  },
  hello: (): Response => {
    console.log("INSIDE_HELLO");
    return new Response('Hello world ' + new Date() + '!');
  },
  bookById: bookById()
};
