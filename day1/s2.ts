export const calibration = async () => {
  const inputFile = Bun.file("day1/input.txt");
  const lines = (await inputFile.text()).split("\n");
  const regex = /\d/g;
  return lines
    .map((l) => {
      return l
        .replaceAll("nine", "nin9e")
        .replaceAll("eight", "eigh8t")
        .replaceAll("seven", "seve7n")
        .replaceAll("six", "si6x")
        .replaceAll("five", "fiv5e")
        .replaceAll("four", "fou4r")
        .replaceAll("three", "thre3e")
        .replaceAll("two", "tw2o")
        .replaceAll("one", "on1e");
    })
    .map((l) => {
      const numbers = [...l.matchAll(regex)];
      if (numbers.length > 0) {
        let n1 = numbers[0][0];
        let n2 = numbers[numbers.length - 1][0];
        return n1 + n2;
      }

      return 0;
    })
    .map((l) => Number(l))
    .reduce((a, b) => a + b);
};
