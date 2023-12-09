enum HandType {
  HighCard,
  OnePair,
  TwoPair,
  ThreeOfAKind,
  FullHouse,
  FourOfAKind,
  FiveOfAKind,
}

interface IHand {
  cards: string[];
  type: HandType;
  bid: number;
}

const CARD_VALUES = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "T",
  "J",
  "Q",
  "K",
  "A",
];

export const camelCards = async () => {
  const inputFile = Bun.file("day7/input.txt");
  const lines = (await inputFile.text()).split("\n");

  const hands: IHand[] = [];
  for (const line of lines) {
    const split = line.trim().split(" ");

    if (split.length > 1) {
      const cards = [...split[0]];
      const currentHand: IHand = {
        bid: Number(split[1]),
        cards: cards,
        type: getHandType(cards),
      };
      hands.push(currentHand);
    }
  }

  const sortedHands = hands.sort(compareHands);
  let sum = 0;
  for (let i = 0; i < sortedHands.length; i++) {
    sum = sum + sortedHands[i].bid * (i + 1);
  }

  return sum;
};

const getHandType = (cards: string[]): HandType => {
  const cardMap = new Map<string, number>();
  for (const card of cards) {
    if (!cardMap.has(card)) {
      cardMap.set(card, 1);
    } else {
      cardMap.set(card, cardMap.get(card)! + 1);
    }
  }

  const countDistinct = [...cardMap.keys()].length;

  if (countDistinct === 1) {
    return HandType.FiveOfAKind;
  } else if (countDistinct === 4) {
    return HandType.OnePair;
  }

  const cardCounts = [...cardMap.values()];

  if (cardCounts.some((v) => v === 3)) {
    if (cardCounts.some((v) => v === 2)) {
      return HandType.FullHouse;
    } else {
      return HandType.ThreeOfAKind;
    }
  }

  if (cardCounts.some((v) => v === 4)) {
    return HandType.FourOfAKind;
  }

  if (cardCounts.filter((v) => v === 2).length === 2) {
    return HandType.TwoPair;
  }

  return HandType.HighCard;
};

const compareHands = (a: IHand, b: IHand): number => {
  if (a.type > b.type) {
    return 1;
  } else if (a.type < b.type) {
    return -1;
  }

  for (let i = 0; i < a.cards.length && i < b.cards.length; i++) {
    const aCard = a.cards[i];
    const bCard = b.cards[i];
    if (aCard !== bCard) {
      const aCardIndex = CARD_VALUES.indexOf(aCard);
      const bCardIndex = CARD_VALUES.indexOf(bCard);

      if (aCardIndex > bCardIndex) {
        return 1;
      } else if (aCardIndex < bCardIndex) {
        return -1;
      }
    }
  }

  return 0;
};
