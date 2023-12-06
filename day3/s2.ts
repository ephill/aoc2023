interface IPartNumber {
  value: number;
  startX: number;
  endX: number;
  y: number;
}

export const gears = async () => {
  const inputFile = Bun.file("day3/input.txt");
  const lines = (await inputFile.text()).split("\n");
  const input = lines.map((l) => [...l]);
  let sum = 0;

  let partNumbers: IPartNumber[] = [];

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
        partNumbers.push({
          value: Number(currentValue),
          startX,
          endX,
          y,
        });

        currentValue = "";
        startX = -1;
        endX = -1;
      }
    }
  }

  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      const value = input[y][x];

      if (value === "*") {
        const adjacentParts = partNumbers.filter((p) => {
          if (p.startX - 1 <= x && p.endX + 1 >= x) {
            if (p.y >= y - 1 && p.y <= y + 1) {
              return true;
            }
          }

          return false;
        });

        if (adjacentParts.length === 2) {
          sum = sum + adjacentParts[0].value * adjacentParts[1].value;
        }
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
  let result: string[][] = [];

  let i = 0;
  let j = 0;
  for (let y = Math.max(startY, 0); y < input.length && y <= endY; y++) {
    let row = [];
    for (let x = Math.max(startX, 0); x < input[y].length && x <= endX; x++) {
      row[i] = input[y][x];
      i++;
    }

    result.push(row);
    j++;
  }

  return result;
};
