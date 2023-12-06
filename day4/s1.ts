import { logJson } from "../util";

interface IScratchCard {
  cardNumber: number;
  winningNumbers: number[];
  myNumbers: number[];
}

export const cardPoints = async () => {
  const inputFile = Bun.file("day4/input.txt");
  const lines = (await inputFile.text()).split("\n");

  const cards: IScratchCard[] = [];
  let sum = 0;

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
      });
    }
  }

  logJson(cards);

  for (const card of cards) {
    const wins = card.myNumbers.filter(
      (n) => card.winningNumbers.indexOf(n) > -1
    );

    if (wins.length > 0) {
      sum = sum + Math.pow(2, wins.length - 1);
    }
  }

  return sum;
};
