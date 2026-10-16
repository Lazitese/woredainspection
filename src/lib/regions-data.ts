export const AKAKI_KALITY_WOREDAS = [
  'ወረዳ 1',
  'ወረዳ 2',
  'ወረዳ 3',
  'ወረዳ 4',
  'ወረዳ 5',
  'ወረዳ 6',
  'ወረዳ 7',
  'ወረዳ 8',
  'ወረዳ 9',
  'ወረዳ 10',
  'ወረዳ 11',
  'ወረዳ 13',
] as const;

export type AkakiKalityWoreda = typeof AKAKI_KALITY_WOREDAS[number];

// Primary geographical mapping for the 12 Woredas (Woreda 1-13, skipping 12)
export const regionsData: Record<string, string[]> = {
  "ወረዳ 1": [],
  "ወረዳ 2": [],
  "ወረዳ 3": [],
  "ወረዳ 4": [],
  "ወረዳ 5": [],
  "ወረዳ 6": [],
  "ወረዳ 7": [],
  "ወረዳ 8": [],
  "ወረዳ 9": [],
  "ወረዳ 10": [],
  "ወረዳ 11": [],
  "ወረዳ 13": [],
};
