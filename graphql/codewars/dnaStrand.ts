export class Kata {
  static dnaStrand(dna: string): string {
    const complements: any = {
      "A": "T",
      "T": "A",
      "G": "C",
      "C": "G"
    }
    return dna.replace(/[ATGC]/g, (substring) => complements[substring]);
  }
}