type Opener = {
  '{': string,
  '(': string,
  '[': string,
}

export function validBraces(braces: string): boolean {
  const stack: string[] = [];

  const closers: Map<string, keyof Opener> = new Map<string, keyof Opener>([
    [")", "("],
    ["}", "{"],
    ["]", "["],
  ])

  const openers = new Set<string>(Array.from(closers.values()));

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