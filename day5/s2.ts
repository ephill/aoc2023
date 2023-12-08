const SEEDS_TOKEN = "seeds:";
const SEED_TO_SOIL_TOKEN = "seed-to-soil map:";
const SOIL_TO_FERTILIZER_TOKEN = "soil-to-fertilizer map:";
const FERTILIZER_TO_WATER_TOKEN = "fertilizer-to-water map:";
const WATER_TO_LIGHT_TOKEN = "water-to-light map:";
const LIGHT_TO_TEMPERATURE_TOKEN = "light-to-temperature map:";
const TEMPERATURE_TO_HUUMIDITY_TOKEN = "temperature-to-humidity map:";
const HUMIDITY_TO_LOCATION_TOKEN = "humidity-to-location map:";

const tokenOrder = [
  SEEDS_TOKEN,
  SEED_TO_SOIL_TOKEN,
  SOIL_TO_FERTILIZER_TOKEN,
  FERTILIZER_TO_WATER_TOKEN,
  WATER_TO_LIGHT_TOKEN,
  LIGHT_TO_TEMPERATURE_TOKEN,
  TEMPERATURE_TO_HUUMIDITY_TOKEN,
  HUMIDITY_TO_LOCATION_TOKEN,
];

interface ILookupRange {
  destinationRangeStart: number;
  sourceRangeStart: number;
  rangeLength: number;
}

interface IRange {
  start: number;
  rangeLength: number;
}

interface IAlmanac {
  seeds: IRange[];
  seedToSoil: ILookupRange[];
  soilToFertilizer: ILookupRange[];
  fertilizerToWater: ILookupRange[];
  waterToLight: ILookupRange[];
  lightToTemperature: ILookupRange[];
  temperatureToHumidity: ILookupRange[];
  humidityToLocation: ILookupRange[];
}

export const almanac = async () => {
  const inputFile = Bun.file("day5/input.txt");
  const lines = (await inputFile.text()).split("\n");

  let i = 0;
  let currentToken = tokenOrder[i++];
  let foundToken = false;
  const almanac: IAlmanac = {
    seeds: [],
    seedToSoil: [],
    soilToFertilizer: [],
    fertilizerToWater: [],
    waterToLight: [],
    lightToTemperature: [],
    temperatureToHumidity: [],
    humidityToLocation: [],
  };

  for (const line of lines) {
    if (line.startsWith(currentToken)) {
      if (currentToken === SEEDS_TOKEN) {
        const seedSplit = line
          .slice(SEEDS_TOKEN.length + 1)
          .trim()
          .split(" ");

        for (let i = 0; i < seedSplit.length - 1; i = i + 2) {
          const start = Number(seedSplit[i]);
          const rangeLength = Number(seedSplit[i + 1]);

          almanac.seeds.push({ start, rangeLength });
        }
      } else {
        foundToken = true;
      }
    } else if (line === "") {
      currentToken = tokenOrder[i++];
      foundToken = false;
    } else if (foundToken) {
      const split = line.split(" ");
      if (split.length == 3) {
        const lookup: ILookupRange = {
          destinationRangeStart: Number(split[0]),
          sourceRangeStart: Number(split[1]),
          rangeLength: Number(split[2]),
        };

        switch (currentToken) {
          case SEED_TO_SOIL_TOKEN:
            almanac.seedToSoil.push(lookup);
            break;
          case SOIL_TO_FERTILIZER_TOKEN:
            almanac.soilToFertilizer.push(lookup);
            break;
          case FERTILIZER_TO_WATER_TOKEN:
            almanac.fertilizerToWater.push(lookup);
            break;
          case WATER_TO_LIGHT_TOKEN:
            almanac.waterToLight.push(lookup);
            break;
          case LIGHT_TO_TEMPERATURE_TOKEN:
            almanac.lightToTemperature.push(lookup);
            break;
          case TEMPERATURE_TO_HUUMIDITY_TOKEN:
            almanac.temperatureToHumidity.push(lookup);
            break;
          case HUMIDITY_TO_LOCATION_TOKEN:
            almanac.humidityToLocation.push(lookup);
            break;
        }
      }
    }
  }

  const soils = lookupValue(almanac.seeds, almanac.seedToSoil);
  const fertilizers = lookupValue(soils, almanac.soilToFertilizer);
  const waters = lookupValue(fertilizers, almanac.fertilizerToWater);
  const lights = lookupValue(waters, almanac.waterToLight);
  const temperatures = lookupValue(lights, almanac.lightToTemperature);
  const humiditys = lookupValue(temperatures, almanac.temperatureToHumidity);
  const locations = lookupValue(humiditys, almanac.humidityToLocation);

  return Math.min(...locations.map((r) => r.start));
};

const lookupValue = (ranges: IRange[], lookup: ILookupRange[]): IRange[] => {
  const result: IRange[] = [];

  for (const range of ranges) {
    let min = range.start;
    const max = range.start + range.rangeLength;
    const matchingRanges = lookup
      .filter((r) => {
        const matchingRangeMin = r.sourceRangeStart;
        const matchingRangeMax = r.sourceRangeStart + r.rangeLength;

        if (matchingRangeMin <= min && matchingRangeMax >= max) {
          // Fully contained
          return true;
        } else if (matchingRangeMin >= min && matchingRangeMin <= max) {
          // Partially contained
          return true;
        } else if (matchingRangeMax <= max && matchingRangeMax >= min) {
          // Partially contained
          return true;
        } else {
          return false;
        }
      })
      .sort((a, b) => a.sourceRangeStart - b.sourceRangeStart);

    if (matchingRanges.length > 0) {
      for (const match of matchingRanges) {
        const matchingRangeMin = match.sourceRangeStart;
        const matchingRangeMax = match.sourceRangeStart + match.rangeLength;

        if (min < matchingRangeMin) {
          result.push({
            start: min,
            rangeLength: matchingRangeMin - min,
          });
          min = matchingRangeMin;
        }

        if (min >= matchingRangeMin && max > matchingRangeMax) {
          result.push({
            start: match.destinationRangeStart + (min - matchingRangeMin),
            rangeLength: matchingRangeMax - min,
          });

          min = matchingRangeMax;
        }

        if (
          min >= match.sourceRangeStart &&
          max <= match.sourceRangeStart + match.rangeLength
        ) {
          result.push({
            start: match.destinationRangeStart + (min - match.sourceRangeStart),
            rangeLength: max - min,
          });

          min = max;
        }
      }

      if (min < max) {
        result.push({
          start: min,
          rangeLength: max - min,
        });
      }
    } else {
      result.push(range);
    }
  }

  return result;
};
