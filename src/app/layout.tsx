import type { Metadata } from "next";
import { Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { WoredaProvider } from "@/providers/woreda-provider";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://woreda.raey.work'),
  title: {
    default: "የወረዳዎች ብልጽግና የኢንስፔክሽንና የስነ ምግባር ኮሚሽን ፅ/ቤቶች",
    template: "%s | የወረዳ ብልጽግና የኢንስፔክሽንና የስነ ምግባር ኮሚሽን"
  },
  description: "የአቃቂ ቃሊቲ ወረዳዎች ብልጽግና የኢንስፔክሽንና የስነ ምግባር ኮሚሽን የተቀናጀ የኮሚሽን ሥራዎች ዲጂታል ሥርዓት (ICODiS)።",
  keywords: [
    "ወረዳ",
    "አቃቂ ቃሊቲ",
    "ብልጽግና",
    "ኢንስፔክሽን",
    "ሥነ-ምግባር",
    "ኮሚሽን",
    "ተጠያቂነት",
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: "website",
    locale: "am_ET",
    url: "/",
    siteName: "የወረዳዎች ብልጽግና የኢንስፔክሽንና የስነ ምግባር ኮሚሽን ፅ/ቤቶች",
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "የወረዳ ብልጽግና የኢንስፔክሽንና የስነ ምግባር ኮሚሽን ምልክት",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "የወረዳዎች ብልጽግና የኢንስፔክሽንና የስነ ምግባር ኮሚሽን ፅ/ቤቶች",
    description: "የአቃቂ ቃሊቲ ወረዳዎች ብልጽግና የኢንስፔክሽንና የስነ ምግባር ኮሚሽን የተቀናጀ የኮሚሽን ሥራዎች ዲጂታል ሥርዓት (ICODiS)።",
    images: ["/logo.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="am"
      data-scroll-behavior="smooth"
      className={`${plusJakarta.variable} ${instrumentSerif.variable} min-h-full antialiased scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="min-h-full font-sans" suppressHydrationWarning>
        <I18nProvider>
          <WoredaProvider>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-primary-foreground focus:shadow-lg"
            >
              ወደ ዋናው ይዘት ይሂዱ
            </a>
            {children}
            <AnalyticsTracker />
          </WoredaProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
