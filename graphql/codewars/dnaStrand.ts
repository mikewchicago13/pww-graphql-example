export class Kata {
  static dnaStrand(dna: string): string {
    const complements: any = {
      "A": "T",
      "T": "A",
      "G": "C",
      "C": "G"
    }
    const result: string[] = [];
    for (let i = 0; i < dna.length; i++) {
      result.push(complements[dna[i]])
    }
    return result.join("");
  }
}