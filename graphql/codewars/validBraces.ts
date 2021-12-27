export function validBraces(braces: string): boolean {
  const stack: string[] = [];

  const openers: Set<string> = new Set<string>(["{", "(", "["]);

  const closers: Map<string, string> = new Map<string, string>([
    [")", "("],
    ["}", "{"],
    ["]", "["]
  ]);

  for (let i = 0; i < braces.length; i++) {
    const char = braces[i];
    if (openers.has(char)) {
      stack.push(char);
    }
    if (closers.has(char)) {
      const pop = stack.pop();
      if (closers.get(char) !== pop) {
        return false;
      }
    }
  }
  return stack.length === 0;
}