interface IScratchCard {
  cardNumber: number;
  winningNumbers: number[];
  myNumbers: number[];
  copies: number;
}

export const countCards = async () => {
  const inputFile = Bun.file("day4/input.txt");
  const lines = (await inputFile.text()).split("\n");

  let cards: IScratchCard[] = [];

  for (const line of lines) {
    const colonIndex = line.indexOf(":");
    const cardNumber = Number(line.slice(0, colonIndex).match(/\d+/)?.pop());
    if (cardNumber) {
      const remainder = line.slice(colonIndex + 1);
      const split = remainder.split("|");

      const winningNumbers = split[0]
        .split(" ")
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
        .map((s) => Number(s));
      const myNumbers = split[1]
        .split(" ")
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
        .map((s) => Number(s));

      cards.push({
        cardNumber,
        winningNumbers,
        myNumbers,
        copies: 1,
      });
    }
  }

  let sum = 0;

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const wins = card.myNumbers.filter(
      (n) => card.winningNumbers.indexOf(n) > -1
    );
    const copies = cards.slice(i + 1, i + wins.length + 1);

    for (let j = 0; j < card.copies; j++) {
      for (const copy of copies) {
        copy.copies = copy.copies + 1;
      }

      sum = sum + 1;
    }
  }

  return sum;
};
