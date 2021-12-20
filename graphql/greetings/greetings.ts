import Response from "./response";

export class Greetings {
  static goodbye(
    _: unknown,
    {name}: { name: string }
  ): Response {
    console.log("INSIDE_GOODBYE " + name);
    return new Response('Goodbye ' + name + ' ' + new Date() + '!');
  }

  static hello(): Response {
    console.log("INSIDE_HELLO");
    return new Response('Hello world ' + new Date() + '!');
  }
}