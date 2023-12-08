interface IRace {
  time: number;
  recordDistance: number;
}

const TIME_TOKEN = "Time:";
const DISTANCE_TOKEN = "Distance:";

export const races = async () => {
  const inputFile = Bun.file("day6/input.txt");
  const lines = (await inputFile.text()).split("\n");

  const races: IRace[] = [];

  const times = lines.find((l) => l.startsWith(TIME_TOKEN));
  const distances = lines.find((l) => l.startsWith(DISTANCE_TOKEN));

  if (times && distances) {
    const timeNumbers = times
      .slice(TIME_TOKEN.length)
      .trim()
      .split(" ")
      .filter((s) => s !== "")
      .map((s) => Number(s));
    const distanceNumbers = distances
      .slice(DISTANCE_TOKEN.length)
      .trim()
      .split(" ")
      .filter((s) => s !== "")
      .map((s) => Number(s));

    for (let i = 0; i < timeNumbers.length && i < distanceNumbers.length; i++) {
      races.push({
        time: timeNumbers[i],
        recordDistance: distanceNumbers[i],
      });
    }
  }

  let sum = 0;
  for (const race of races) {
    let raceSum = 0;
    for (let i = 0; i <= race.time; i++) {
      const result = i * (race.time - i);
      if (result > race.recordDistance) {
        raceSum = raceSum + 1;
      }
    }

    if (raceSum > 0) {
      if (sum === 0) {
        sum = raceSum;
      } else {
        sum = sum * raceSum;
      }
    }
  }

  return sum;
};
