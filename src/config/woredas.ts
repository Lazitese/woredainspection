export interface WoredaStats {
  unions: number;   // የህብረት ብዛት
  families: number; // የቤተሰብ ብዛት
  members: number;  // የአባል ብዛት
}

export interface WoredaConfig {
  id: string;
  slug: string;
  number: number;
  name: string;
  nameAm?: string;
  nameEn: string;
  organizationName: string;
  shortTitle: string;
  description: string;
  leaderName?: string;
  leaderNameEn?: string;
  phone?: string;
  email?: string;
  stats: WoredaStats;
}

export const WOREDAS_LIST: WoredaConfig[] = [
  {
    id: 'woreda1',
    slug: 'woreda1',
    number: 1,
    name: 'ወረዳ 1',
    nameAm: 'ወረዳ 1',
    nameEn: 'Woreda 01',
    organizationName: 'የወረዳ 1 ብልጽግና የኢንስፔክሽንና የስነ ምግባር ኮሚሽን ፅ/ቤት',
    shortTitle: 'ወረዳ 1 ኮሚሽን ፅ/ቤት',
    description: 'የአቃቂ ቃሊቲ ወረዳ 1 ብልጽግና የኢንስፔክሽንና የስነ ምግባር ኮሚሽን የተቀናጀ የሥራዎች ዲጂታል ሥርዓት (ICODiS)።',
    leaderName: 'አወል ሰይድ ይመር',
    leaderNameEn: 'Awel Seid Yimer',
    phone: '0921175509',
    email: 'awelseid09@gmail.com',
    stats: {
      unions: 28,
      families: 142,
      members: 3993,
    },
  },
  {
    id: 'woreda2',
    slug: 'woreda2',
    number: 2,
    name: 'ወረዳ 2',
    nameAm: 'ወረዳ 2',
    nameEn: 'Woreda 02',
    organizationName: 'የወረዳ 2 ብልጽግና የኢንስፔክሽንና የስነ ምግባር ኮሚሽን ፅ/ቤት',
    shortTitle: 'ወረዳ 2 ኮሚሽን ፅ/ቤት',
    description: 'የአቃቂ ቃሊቲ ወረዳ 2 ብልጽግና የኢንስፔክሽንና የስነ ምግባር ኮሚሽን የተቀናጀ የሥራዎች ዲጂታል ሥርዓት (ICODiS)።',
    leaderName: 'የወረዳ 2 ዋና አስተዳዳሪ',
    phone: '0911000002',
    email: 'woreda2@akakikality.gov.et',
    stats: {
      unions: 30,
      families: 160,
      members: 4200,
    },
  },
  {
    id: 'woreda3',
    slug: 'woreda3',
    number: 3,
    name: 'ወረዳ 3',
    nameAm: 'ወረዳ 3',
    nameEn: 'Woreda 03',
    organizationName: 'የወረዳ 3 ብልጽግና የኢንስፔክሽንና የስነ ምግባር ኮሚሽን ፅ/ቤት',
    shortTitle: 'ወረዳ 3 ኮሚሽን ፅ/ቤት',
    description: 'የአቃቂ ቃሊቲ ወረዳ 3 ብልጽግና የኢንስፔክሽንና የስነ ምግባር ኮሚሽን የተቀናጀ የሥራዎች ዲጂታል ሥርዓት (ICODiS)።',
    leaderName: 'ታዳገ ባንዳ',
    phone: '0982416533',
    email: 'tedegabanda@gmail.com',
    stats: {
      unions: 51,
      families: 297,
      members: 8542,
    },
  },
  {
    id: 'woreda4',
    slug: 'woreda4',
    number: 4,
    name: 'ወረዳ 4',
    nameAm: 'ወረዳ 4',
    nameEn: 'Woreda 04',
    organizationName: 'የወረዳ 4 ብልጽግና የኢንስፔክሽንና የስነ ምግባር ኮሚሽን ፅ/ቤት',
    shortTitle: 'ወረዳ 4 ኮሚሽን ፅ/ቤት',
    description: 'የአቃቂ ቃሊቲ ወረዳ 4 ብልጽግና የኢንስፔክሽንና የስነ ምግባር ኮሚሽን የተቀናጀ የሥራዎች ዲጂታል ሥርዓት (ICODiS)።',
    leaderName: 'ሳሮን አበበ',
    phone: '0926876069',
    email: 'saronabebelenjamoaju@gmail.com',
    stats: {
      unions: 42,
      families: 240,
      members: 7240,
    },
  },
  {
    id: 'woreda5',
    slug: 'woreda5',
    number: 5,
    name: 'ወረዳ 5',
    nameAm: 'ወረዳ 5',
    nameEn: 'Woreda 05',
    organizationName: 'የወረዳ 5 ብልጽግና የኢንስፔክሽንና የስነ ምግባር ኮሚሽን ፅ/ቤት',
    shortTitle: 'ወረዳ 5 ኮሚሽን ፅ/ቤት',
    description: 'የአቃቂ ቃሊቲ ወረዳ 5 ብልጽግና የኢንስፔክሽንና የስነ ምግባር ኮሚሽን የተቀናጀ የሥራዎች ዲጂታል ሥርዓት (ICODiS)።',
    leaderName: 'አሜን ጉታዳቢ',
    phone: '0911693325',
    email: 'amareguta42@gmail.com',
    stats: {
      unions: 40,
      families: 241,
      members: 6930,
    },
  },
  {
    id: 'woreda6',
    slug: 'woreda6',
    number: 6,
    name: 'ወረዳ 6',
    nameAm: 'ወረዳ 6',
    nameEn: 'Woreda 06',
    organizationName: 'የወረዳ 6 ብልጽግና የኢንስፔክሽንና የስነ ምግባር ኮሚሽን ፅ/ቤት',
    shortTitle: 'ወረዳ 6 ኮሚሽን ፅ/ቤት',
    description: 'የአቃቂ ቃሊቲ ወረዳ 6 ብልጽግና የኢንስፔክሽንና የስነ ምግባር ኮሚሽን የተቀናጀ የሥራዎች ዲጂታል ሥርዓት (ICODiS)።',
    leaderName: 'ሁሴን አስፋው',
    phone: '0922827853',
    email: 'husenasfawa2026@gmail.com',
    stats: {
      unions: 44,
      families: 250,
      members: 4900,
    },
  },
  {
    id: 'woreda7',
    slug: 'woreda7',
    number: 7,
    name: 'ወረዳ 7',
    nameAm: 'ወረዳ 7',
    nameEn: 'Woreda 07',
    organizationName: 'የወረዳ 7 ብልጽግና የኢንስፔክሽንና የስነ ምግባር ኮሚሽን ፅ/ቤት',
    shortTitle: 'ወረዳ 7 ኮሚሽን ፅ/ቤት',
    description: 'የአቃቂ ቃሊቲ ወረዳ 7 ብልጽግና የኢንስፔክሽንና የስነ ምግባር ኮሚሽን የተቀናጀ የሥራዎች ዲጂታል ሥርዓት (ICODiS)።',
    leaderName: 'ፍሬህይወት አያል',
    phone: '0920711230',
    email: 'frehiwotayal@gmail.com',
    stats: {
      unions: 50,
      families: 304,
      members: 7691,
    },
  },
  {
    id: 'woreda8',
    slug: 'woreda8',
    number: 8,
    name: 'ወረዳ 8',
    nameAm: 'ወረዳ 8',
    nameEn: 'Woreda 08',
    organizationName: 'የወረዳ 8 ብልጽግና የኢንስፔክሽንና የስነ ምግባር ኮሚሽን ፅ/ቤት',
    shortTitle: 'ወረዳ 8 ኮሚሽን ፅ/ቤት',
    description: 'የአቃቂ ቃሊቲ ወረዳ 8 ብልጽግና የኢንስፔክሽንና የስነ ምግባር ኮሚሽን የተቀናጀ የሥራዎች ዲጂታል ሥርዓት (ICODiS)።',
    leaderName: 'ፅጌሬዳ ደበበ',
    phone: '0913024710',
    email: 'tsigeredadebebe2016@gmail.com',
    stats: {
      unions: 44,
      families: 273,
      members: 6559,
    },
  },
  {
    id: 'woreda9',
    slug: 'woreda9',
    number: 9,
    name: 'ወረዳ 9',
    nameAm: 'ወረዳ 9',
    nameEn: 'Woreda 09',
    organizationName: 'የወረዳ 9 ብልጽግና የኢንስፔክሽንና የስነ ምግባር ኮሚሽን ፅ/ቤት',
    shortTitle: 'ወረዳ 9 ኮሚሽን ፅ/ቤት',
    description: 'የአቃቂ ቃሊቲ ወረዳ 9 ብልጽግና የኢንስፔክሽንና የስነ ምግባር ኮሚሽን የተቀናጀ የሥራዎች ዲጂታል ሥርዓት (ICODiS)።',
    leaderName: 'የወረዳ 9 ዋና አስተዳዳሪ',
    phone: '0911000009',
    email: 'woreda9@akakikality.gov.et',
    stats: {
      unions: 28,
      families: 150,
      members: 4100,
    },
  },
  {
    id: 'woreda10',
    slug: 'woreda10',
    number: 10,
    name: 'ወረዳ 10',
    nameAm: 'ወረዳ 10',
    nameEn: 'Woreda 10',
    organizationName: 'የወረዳ 10 ብልጽግና የኢንስፔክሽንና የስነ ምግባር ኮሚሽን ፅ/ቤት',
    shortTitle: 'ወረዳ 10 ኮሚሽን ፅ/ቤት',
    description: 'የአቃቂ ቃሊቲ ወረዳ 10 ብልጽግና የኢንስፔክሽንና የስነ ምግባር ኮሚሽን የተቀናጀ የሥራዎች ዲጂታል ሥርዓት (ICODiS)።',
    leaderName: 'ልንገርሽ ድረስ',
    phone: '0921578378',
    email: 'lingershdires21@gmail.com',
    stats: {
      unions: 24,
      families: 124,
      members: 4002,
    },
  },
  {
    id: 'woreda11',
    slug: 'woreda11',
    number: 11,
    name: 'ወረዳ 11',
    nameAm: 'ወረዳ 11',
    nameEn: 'Woreda 11',
    organizationName: 'የወረዳ 11 ብልጽግና የኢንስፔክሽንና የስነ ምግባር ኮሚሽን ፅ/ቤት',
    shortTitle: 'ወረዳ 11 ኮሚሽን ፅ/ቤት',
    description: 'የአቃቂ ቃሊቲ ወረዳ 11 ብልጽግና የኢንስፔክሽንና የስነ ምግባር ኮሚሽን የተቀናጀ የሥራዎች ዲጂታል ሥርዓት (ICODiS)።',
    leaderName: 'የወረዳ 11 ዋና አስተዳዳሪ',
    phone: '0911000011',
    email: 'woreda11@akakikality.gov.et',
    stats: {
      unions: 32,
      families: 180,
      members: 4500,
    },
  },
  // Woreda 12 is skipped as requested
  {
    id: 'woreda13',
    slug: 'woreda13',
    number: 13,
    name: 'ወረዳ 13',
    nameAm: 'ወረዳ 13',
    nameEn: 'Woreda 13',
    organizationName: 'የወረዳ 13 ብልጽግና የኢንስፔክሽንና የስነ ምግባር ኮሚሽን ፅ/ቤት',
    shortTitle: 'ወረዳ 13 ኮሚሽን ፅ/ቤት',
    description: 'የአቃቂ ቃሊቲ ወረዳ 13 ብልጽግና የኢንስፔክሽንና የስነ ምግባር ኮሚሽን የተቀናጀ የሥራዎች ዲጂታል ሥርዓት (ICODiS)።',
    leaderName: 'አዲሱ ይሁን',
    phone: '0953933884',
    email: 'addisuyihun92@gmail.com',
    stats: {
      unions: 22,
      families: 115,
      members: 2891,
    },
  },
];

export const DEFAULT_WOREDA = WOREDAS_LIST[0]; // Woreda 1

export const WOREDA_SLUGS = WOREDAS_LIST.map((w) => w.slug);

export function getWoredaConfig(idOrSlug?: string | null): WoredaConfig {
  if (!idOrSlug) return { ...DEFAULT_WOREDA, nameAm: DEFAULT_WOREDA.nameAm || DEFAULT_WOREDA.name };
  const normalized = idOrSlug.trim().toLowerCase();
  const found = WOREDAS_LIST.find(
    (w) =>
      w.slug.toLowerCase() === normalized ||
      w.id.toLowerCase() === normalized ||
      w.name.toLowerCase() === normalized ||
      `woreda-${w.number}` === normalized ||
      String(w.number) === normalized
  );
  const target = found || DEFAULT_WOREDA;
  return {
    ...target,
    nameAm: target.nameAm || target.name,
  };
}

export function isValidWoreda(idOrSlug?: string | null): boolean {
  if (!idOrSlug) return false;
  const normalized = idOrSlug.trim().toLowerCase();
  return WOREDAS_LIST.some(
    (w) =>
      w.slug.toLowerCase() === normalized ||
      w.id.toLowerCase() === normalized ||
      w.name.toLowerCase() === normalized
  );
}
