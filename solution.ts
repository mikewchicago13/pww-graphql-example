const sayHello = (name?: string): string => {
  const suffix = name ? ", " + name : " there";
  return "Hello" + suffix + "!";
};

export default sayHello;