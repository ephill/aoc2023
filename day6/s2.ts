import { logJson } from "../util";

interface IRace {
  time: number;
  recordDistance: number;
}

const TIME_TOKEN = "Time:";
const DISTANCE_TOKEN = "Distance:";

export const races = async () => {
  const inputFile = Bun.file("day6/input.txt");
  const lines = (await inputFile.text()).split("\n");

  const race: IRace = {
    time: 0,
    recordDistance: 0,
  };

  const times = lines.find((l) => l.startsWith(TIME_TOKEN));
  const distances = lines.find((l) => l.startsWith(DISTANCE_TOKEN));

  if (times && distances) {
    race.time = Number(
      times
        .slice(TIME_TOKEN.length)
        .trim()
        .split(" ")
        .filter((s) => s !== "")
        .reduce((a, b) => a + b)
    );
    race.recordDistance = Number(
      distances
        .slice(DISTANCE_TOKEN.length)
        .trim()
        .split(" ")
        .filter((s) => s !== "")
        .reduce((a, b) => a + b)
    );
  }

  logJson(race);
  let raceSum = 0;
  for (let i = 0; i <= race.time; i++) {
    const result = i * (race.time - i);
    if (result > race.recordDistance) {
      raceSum = raceSum + 1;
    }
  }

  return raceSum;
};
