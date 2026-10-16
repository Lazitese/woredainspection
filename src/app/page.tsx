"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { WOREDAS_LIST } from "@/config/woredas";

export default function HomePage() {
  const router = useRouter();
  const [selectedWoreda, setSelectedWoreda] = useState("");

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const slug = e.target.value;
    if (slug) {
      router.push(`/${slug}`);
    }
  };

  return (
    <main className="min-h-screen bg-white flex flex-col justify-between items-center p-6 sm:p-10 text-center font-sans">
      <div />

      {/* Center content */}
      <div className="my-auto max-w-3xl flex flex-col items-center">
        {/* Logo at the top */}
        <div className="relative size-28 sm:size-36 mb-6 overflow-hidden rounded-full ring-4 ring-[#014BAA]/10 shadow-lg bg-white p-1">
          <Image
            src="/logo.jpg"
            alt="የኢንስፔክሽንና የስነ ምግባር ኮሚሽን ምልክት"
            fill
            sizes="144px"
            className="object-contain"
            priority
          />
        </div>

        {/* Subcity mention */}
        <p className="text-base sm:text-xl font-bold text-slate-600 mb-2 tracking-wide">
          የአዲስ አበባ ከተማ አስተዳደር • የአቃቂ ቃሊቲ ክፍለ ከተማ
        </p>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
          የተቀናጀ የኮሚሽን ሥራዎች
          <span className="block text-[#014BAA] mt-2 sm:mt-3">
            ዲጂታል ሥርዓት (ICODiS)
          </span>
        </h1>

        {/* Woreda Selector */}
        <div className="mt-10 sm:mt-12 w-full max-w-md flex flex-col items-center gap-4">
          <div className="w-full relative">
            <select
              value={selectedWoreda}
              onChange={handleSelect}
              className="w-full appearance-none rounded-2xl border-2 border-slate-200 bg-white px-5 py-3.5 pr-10 text-base font-semibold text-slate-800 shadow-sm transition hover:border-[#014BAA] focus:border-[#014BAA] focus:outline-none focus:ring-4 focus:ring-[#014BAA]/10 cursor-pointer text-center"
            >
              <option value="">-- ወረዳዎን ይምረጡ (Select Woreda) --</option>
              {WOREDAS_LIST.map((w) => (
                <option key={w.id} value={w.slug}>
                  {w.name} ({w.shortTitle})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500">
              <svg className="size-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Quick pills for 12 woredas */}
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {WOREDAS_LIST.map((w) => (
              <Link
                key={w.id}
                href={`/${w.slug}`}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-[#014BAA] hover:text-white text-slate-700 transition-colors shadow-2xs"
              >
                {w.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Minimal Footer */}
      <footer className="text-xs text-slate-400 py-4">
        © 2018 የአቃቂ ቃሊቲ ክፍለ ከተማ ወረዳዎች ብልጽግና የኢንስፔክሽንና የስነ ምግባር ኮሚሽን ፅ/ቤቶች (ICODiS)
      </footer>
    </main>
  );
}
