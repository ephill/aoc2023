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

interface IAlmanac {
  seeds: number[];
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
        almanac.seeds = line
          .slice(SEEDS_TOKEN.length + 1)
          .trim()
          .split(" ")
          .map((s) => Number(s));
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

  let min = Number.MAX_VALUE;
  for (const seed of almanac.seeds) {
    const soil = lookupValue(seed, almanac.seedToSoil);
    const fertilizer = lookupValue(soil, almanac.soilToFertilizer);
    const water = lookupValue(fertilizer, almanac.fertilizerToWater);
    const light = lookupValue(water, almanac.waterToLight);
    const temperature = lookupValue(light, almanac.lightToTemperature);
    const humidity = lookupValue(temperature, almanac.temperatureToHumidity);
    const location = lookupValue(humidity, almanac.humidityToLocation);
    min = Math.min(min, location);
  }

  return min;
};

const lookupValue = (value: number, ranges: ILookupRange[]) => {
  const matchingRange = ranges.find(
    (r) =>
      r.sourceRangeStart <= value && r.sourceRangeStart + r.rangeLength >= value
  );
  if (matchingRange) {
    const diff = value - matchingRange.sourceRangeStart;
    return matchingRange.destinationRangeStart + diff;
  }

  return value;
};
