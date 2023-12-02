export const calibration = async () => {
  const inputFile = Bun.file("day1/input.txt");
  const lines = (await inputFile.text()).split("\n");
  const regex = /\d/g;
  return lines
    .map((l) => {
      const numbers = [...l.matchAll(regex)];
      if (numbers.length > 0) {
        const n1 = numbers[0][0];
        const n2 = numbers[numbers.length - 1][0];
        return n1 + n2;
      }

      return 0;
    })
    .map((l) => Number(l))
    .reduce((a, b) => a + b);
};
