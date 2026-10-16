import { Menubar } from "@/components/menubar";
import { HeroSection } from "@/components/hero-section";
import { ChairmanMessageSection } from "@/components/chairman-message-section";
import { NewsMessagesSection } from "@/components/news-messages-section";
import { MembersSection } from "@/components/members-section";
import { AboutMissionVisionSection } from "@/components/about-mission-vision-section";
import { AnalyticsSection } from "@/components/analytics-section";
import { Footer } from "@/components/footer";
import { getWoredaConfig, isValidWoreda, WOREDA_SLUGS } from "@/config/woredas";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export function generateStaticParams() {
  return WOREDA_SLUGS.map((slug) => ({ woreda: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ woreda: string }>;
}): Promise<Metadata> {
  const { woreda } = await params;
  if (!isValidWoreda(woreda)) {
    return { title: "አልተገኘም | Not Found" };
  }
  const config = getWoredaConfig(woreda);
  return {
    title: config.organizationName,
    description: config.description,
  };
}

export default async function WoredaHomePage({
  params,
}: {
  params: Promise<{ woreda: string }>;
}) {
  const { woreda } = await params;
  if (!isValidWoreda(woreda)) {
    notFound();
  }

  return (
    <>
      <Menubar />
      <main id="main-content">
        <HeroSection />
        <AboutMissionVisionSection />
        <ChairmanMessageSection />
        <NewsMessagesSection />
        <MembersSection />
        <AnalyticsSection />
      </main>
      <Footer />
    </>
  );
}
