interface IGame {
  id: number;
  red: number;
  green: number;
  blue: number;
}

export const game = async () => {
  const inputFile = Bun.file("day2/input.txt");
  const lines = (await inputFile.text()).split("\n");

  const games: IGame[] = [];

  for (const line of lines) {
    const colonIndex = line.indexOf(":");
    const id = Number(line.slice(0, colonIndex).match(/\d+/)?.pop());
    if (id) {
      let red = 0;
      let green = 0;
      let blue = 0;

      const remainder = line.slice(colonIndex + 1);
      const rounds = remainder.split(";").map((s) => s.trim());
      for (const round of rounds) {
        const roundRed = Number(round.match(/(\d+) red/)?.pop()) || 0;
        const roundGreen = Number(round.match(/(\d+) green/)?.pop()) || 0;
        const roundBlue = Number(round.match(/(\d+) blue/)?.pop()) || 0;

        red = Math.max(red, roundRed);
        green = Math.max(green, roundGreen);
        blue = Math.max(blue, roundBlue);
      }

      games.push({
        id,
        red,
        green,
        blue,
      });
    }
  }

  let sum = 0;
  for (const game of games) {
    sum = sum + game.red * game.blue * game.green;
  }

  return sum;
};
