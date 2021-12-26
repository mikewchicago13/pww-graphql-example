export const isPangram = (phrase: string): boolean => {
  const charactersPresent: any = {};
  const asUpperCase = phrase.toUpperCase();
  for (let i = 0; i < asUpperCase.length; i++) {
    charactersPresent[asUpperCase[i]] = true;
  }
  return Object.keys(charactersPresent)
    .sort()
    .join("")
    .includes("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
}