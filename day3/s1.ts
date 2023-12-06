export const parts = async () => {
  const inputFile = Bun.file("day3/input.txt");
  const lines = (await inputFile.text()).split("\n");
  const input = lines.map((l) => [...l]);
  let sum = 0;

  for (let y = 0; y < input.length; y++) {
    let startX = -1;
    let endX = -1;
    let currentValue = "";
    for (let x = 0; x < input[y].length; x++) {
      const value = input[y][x];
      const valueIsDigit = isDigit(value);

      if (valueIsDigit) {
        currentValue += value;

        if (startX == -1) {
          startX = x;
        }

        endX = x;
      }

      if (
        (valueIsDigit === false || x === input[y].length - 1) &&
        currentValue !== ""
      ) {
        const surroundingString = extractRange(
          input,
          startX - 1,
          endX + 1,
          y - 1,
          y + 1
        );

        if ([...surroundingString].some((c) => isSymbol(c))) {
          sum = sum + Number(currentValue);
        }

        currentValue = "";
        startX = -1;
        endX = -1;
      }
    }
  }

  return sum;
};

const isSymbol = (s: string) => {
  return "1234567890.\n".indexOf(s) === -1;
};

const isDigit = (s: string) => {
  return "1234567890".indexOf(s) >= 0;
};

const extractRange = (
  input: string[][],
  startX: number,
  endX: number,
  startY: number,
  endY: number
) => {
  let result = "";

  let i = 0;
  let j = 0;
  for (let y = Math.max(startY, 0); y < input.length && y <= endY; y++) {
    for (let x = Math.max(startX, 0); x < input[y].length && x <= endX; x++) {
      result += input[y][x];
    }

    if (y + 1 < input.length && y + 1 <= endY) {
      result += "\n";
    }
  }

  return result;
};
