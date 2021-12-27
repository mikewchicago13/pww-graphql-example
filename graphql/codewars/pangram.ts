export const isPangram = (phrase: string): boolean => {
  const charactersPresent: Set<string> = new Set<string>();
  const asUpperCase = phrase.toUpperCase();
  for (let i = 0; i < asUpperCase.length; i++) {
    charactersPresent.add(asUpperCase[i]);
  }
  return Array.from(charactersPresent.keys())
    .sort()
    .join("")
    .includes("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
}