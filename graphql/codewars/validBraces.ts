export function validBraces(braces: string): boolean {
  const stack: string[] = [];

  const openers: any = {
    "(": ")",
    "{": "}",
    "[": "]"
  }
  const closers: any = {
    ")": "(",
    "}": "{",
    "]": "["
  }
  for (let i = 0; i < braces.length; i++) {
    const char = braces[i];
    if (char in openers) {
      stack.push(char);
    }
    if (char in closers) {
      const pop = stack.pop();
      if (closers[char] !== pop) {
        return false;
      }
    }
  }
  return stack.length === 0;
}