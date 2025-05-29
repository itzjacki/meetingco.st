export interface Currency {
  conversion: number;
  longName: string;
  unit: string;
}

export function currencyOrDefault(id: string): Currency {
  if (Object.keys(currencies).includes(id)) {
    return currencies[id];
  } else {
    return currencies["USD"];
  }
}

export const currencies: Record<string, Currency> = {
  USD: {
    conversion: 1,
    longName: "US dollar",
    unit: "$x",
  },
  EUR: {
    conversion: 0.89,
    longName: "Euro",
    unit: "€x",
  },
  GBP: {
    conversion: 0.74,
    longName: "British pound",
    unit: "£x",
  },
  NOK: {
    conversion: 10.17,
    longName: "Norwegian krone",
    unit: "x kr",
  },
  SEK: {
    conversion: 9.65,
    longName: "Swedish krona",
    unit: "x kr",
  },
  DKK: {
    conversion: 6.61,
    longName: "Danish krone",
    unit: "x kr",
  },
  CHF: {
    conversion: 0.83,
    longName: "Swiss franc",
    unit: "CHF x",
  },
  AUD: {
    conversion: 1.55,
    longName: "Australian Dollar",
    unit: "A$x",
  },
  CAD: {
    conversion: 1.38,
    longName: "Canadian Dollar",
    unit: "C$x",
  },
  JPY: {
    conversion: 145,
    longName: "Japanese Yen",
    unit: "¥x",
  },
  CNY: {
    conversion: 7.2,
    longName: "Chinese Yuan",
    unit: "¥x",
  },
};
