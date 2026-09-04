"use client";

import Link from "next/link";
import { Menubar } from "@/components/menubar";
import { Footer } from "@/components/footer";
import { ChevronRight, MapPin, Phone, Mail, Clock } from "lucide-react";
export default function ContactPage() {
  return (
    <>
      <Menubar />
      <main className="min-h-screen bg-slate-50 pt-24 pb-16">

        {/* --- Hero Section --- */}
        <section className="relative overflow-hidden bg-white py-16 lg:py-24">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "radial-gradient(#FFB800 2px, transparent 2px)",
              backgroundSize: "32px 32px",
            }}
            aria-hidden="true"
          />
          <div className="container-site relative z-10 flex flex-col items-center text-center">
            <h1 className="font-heading text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              ያግ<span style={{ color: "#FFB800" }}>ኙን</span>
            </h1>
            <div className="mt-6 flex items-center gap-2 text-sm font-medium text-slate-500">
              <span>መነሻ</span>
              <ChevronRight className="size-4" />
              <span style={{ color: "#FFB800" }}>ያግኙን</span>
            </div>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              ለማንኛውም ጥያቄ፣ መረጃ ወይም ማብራሪያ ኮሚሽናችንን በሚከተሉት አድራሻዎች ማግኘት ይችላሉ።
            </p>
          </div>
        </section>

        {/* --- Content Section --- */}
        <section className="container-site -mt-10 relative z-20 pb-16 lg:pb-24">
          <div className="mx-auto max-w-5xl">

            {/* Info Cards - 2x2 Grid */}
            <div className="grid gap-6 sm:grid-cols-2">

              {/* Address */}
              <div className="group relative overflow-hidden rounded-3xl bg-white shadow-[0_4px_20px_-8px_rgba(0,0,0,0.06)] ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_-12px_rgba(1,75,170,0.12)]">
                <div className="absolute inset-x-0 top-0 h-1.5" style={{ background: "linear-gradient(90deg, #014BAA, #3B82F6)" }} />
                <div className="p-8">
                  <div className="flex items-center gap-4">
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[#014BAA]">
                      <MapPin className="size-7" />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-bold text-slate-900">አድራሻ</h3>
                      <p className="text-sm text-slate-500">ቢሮ አድራሻ</p>
                    </div>
                  </div>
                  <div className="mt-5 space-y-1.5 border-t border-slate-100 pt-5">
                    <p className="text-base font-semibold text-slate-800">የአቃቂ ቃሊቲ ክ/ከተማ ኮሚሽን ፅ/ቤት</p>
                    <p className="text-sm text-slate-500">አቃቂ ቃሊቲ ክ/ከተማ፣ አዲስ አበባ</p>
                    <Link
                      href="https://maps.app.goo.gl/oyibfw8ymVbvGZhx9"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-[#014BAA] transition-colors hover:text-blue-700"
                    >
                      በካርታ ላይ ይመልከቱ
                      <ChevronRight className="size-3.5" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="group relative overflow-hidden rounded-3xl bg-white shadow-[0_4px_20px_-8px_rgba(0,0,0,0.06)] ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_-12px_rgba(1,75,170,0.12)]">
                <div className="absolute inset-x-0 top-0 h-1.5" style={{ background: "linear-gradient(90deg, #FFB800, #F59E0B)" }} />
                <div className="p-8">
                  <div className="flex items-center gap-4">
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-[#FFB800]">
                      <Phone className="size-7" />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-bold text-slate-900">ስልክ ቁጥር</h3>
                      <p className="text-sm text-slate-500">የስልክ መረጃዎች</p>
                    </div>
                  </div>
                  <div className="mt-5 space-y-3 border-t border-slate-100 pt-5" style={{ direction: "ltr" }}>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">ክ/ከተማ ፅ/ቤት</p>
                      <p className="mt-0.5 text-sm font-semibold text-slate-800">+251 111 243 462</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">ኢንስፔክሽን ዳይሬክቶሬት</p>
                      <p className="mt-0.5 text-sm font-semibold text-slate-800">+2511112434</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">ሥነ-ምግባር ዳይሬክቶሬት</p>
                      <p className="mt-0.5 text-sm font-semibold text-slate-800">+251 111 243 462</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">ፓስታ ሳጥን</p>
                      <p className="mt-0.5 text-sm font-semibold text-slate-800">80002/80012</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="group relative overflow-hidden rounded-3xl bg-white shadow-[0_4px_20px_-8px_rgba(0,0,0,0.06)] ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_-12px_rgba(1,75,170,0.12)]">
                <div className="absolute inset-x-0 top-0 h-1.5" style={{ background: "linear-gradient(90deg, #014BAA, #3B82F6)" }} />
                <div className="p-8">
                  <div className="flex items-center gap-4">
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[#014BAA]">
                      <Mail className="size-7" />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-bold text-slate-900">ኢሜይል</h3>
                      <p className="text-sm text-slate-500">የኢሜይል አድራሻዎች</p>
                    </div>
                  </div>
                  <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">
                    {[
                      "ppinspectioncommission@gmail.com",
                    ].map((email) => (
                      <a
                        key={email}
                        href={`mailto:${email}`}
                        className="group/email flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-100 transition-all hover:bg-blue-50 hover:text-[#014BAA] hover:ring-blue-200"
                        style={{ direction: "ltr" }}
                      >
                        <Mail className="size-3.5 shrink-0 text-slate-400 transition-colors group-hover/email:text-[#014BAA]" />
                        {email}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Working Hours */}
              <div className="group relative overflow-hidden rounded-3xl bg-white shadow-[0_4px_20px_-8px_rgba(0,0,0,0.06)] ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_-12px_rgba(1,75,170,0.12)]">
                <div className="absolute inset-x-0 top-0 h-1.5" style={{ background: "linear-gradient(90deg, #FFB800, #F59E0B)" }} />
                <div className="p-8">
                  <div className="flex items-center gap-4">
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-[#FFB800]">
                      <Clock className="size-7" />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-bold text-slate-900">የስራ ሰዓት</h3>
                      <p className="text-sm text-slate-500">የስራ ቀናት</p>
                    </div>
                  </div>
                  <div className="mt-5 space-y-4 border-t border-slate-100 pt-5">
                    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-5 py-4 ring-1 ring-slate-100">
                      <span className="text-sm font-bold text-slate-700">ሰኞ - አርብ</span>
                      <span className="text-sm font-semibold text-slate-500">2:30 - 11:30</span>
                    </div>
                    <p className="text-xs font-medium text-slate-400">(የሀገር ውስጥ ሰዓት)</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Social Media (ማህበራዊ ሚዲያ) */}
            <div className="mt-16">
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
                  ማህበራዊ አውታሮች
                </p>
                <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  ማህበራዊ <span style={{ color: "#014BAA" }}>ሚዲያ</span>
                </h2>
                <div className="mx-auto mt-4 h-1 w-12 rounded-full" style={{ backgroundColor: "#FFB800" }} />
                <p className="mx-auto mt-3 max-w-lg text-sm text-slate-600">
                  ወቅታዊ መረጃዎችን፣ ማስታወቂያዎችን እና የኮሚሽኑን የስራ እንቅስቃሴዎች በሚከተሉት ማህበራዊ ሚዲያ ገጾቻችን ይከታተሉ
                </p>
              </div>

              <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
                {[
                  {
                    name: "Facebook",
                    nameAm: "ፌስቡክ",
                    desc: "የኮሚሽኑ ይፋዊ ገጽ",
                    href: "https://www.facebook.com/share/1Ejo7j8cf2/",
                    color: "#1877F2",
                    action: "ገጻችንን ይጎብኙ",
                    icon: (
                      <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    )
                  },
                  {
                    name: "TikTok",
                    nameAm: "ቲክቶክ",
                    desc: "አጫጭር ቪዲዮዎችና መልዕክቶች",
                    href: "https://www.tiktok.com",
                    color: "#000000",
                    action: "ቪዲዮዎችን ይመልከቱ",
                    icon: (
                      <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-3.04-1.52z" />
                      </svg>
                    )
                  },
                  {
                    name: "WhatsApp",
                    nameAm: "ዋትስአፕ",
                    desc: "+251 111 243 462",
                    href: "https://wa.me/251111243462",
                    color: "#25D366",
                    action: "መልዕክት ይላኩ",
                    icon: (
                      <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                      </svg>
                    )
                  },
                  {
                    name: "Twitter (X)",
                    nameAm: "ትዊተር",
                    desc: "ትኩስ መረጃዎችና ዜናዎች",
                    href: "https://x.com",
                    color: "#000000",
                    action: "ይከተሉን",
                    icon: (
                      <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    )
                  },
                  {
                    name: "Telegram",
                    nameAm: "ቴሌግራም",
                    desc: "ይፋዊ የቴሌግራም ቻናል",
                    href: "https://t.me",
                    color: "#229ED9",
                    action: "ቻናሉን ይቀላቀሉ",
                    icon: (
                      <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                      </svg>
                    )
                  },
                ].map((s) => (
                  <Link
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-white p-6 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.06)] ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_35px_-10px_rgba(0,0,0,0.12)]"
                  >
                    <div className="absolute inset-x-0 top-0 h-1 transition-all group-hover:h-1.5" style={{ backgroundColor: s.color }} />
                    <div>
                      <div 
                        className="flex size-12 items-center justify-center rounded-2xl text-white shadow-sm transition-transform group-hover:scale-105"
                        style={{ backgroundColor: s.color }}
                      >
                        {s.icon}
                      </div>
                      <div className="mt-4">
                        <h3 className="font-heading text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {s.name}
                        </h3>
                        <p className="text-xs font-semibold text-slate-500">{s.nameAm}</p>
                        <p className="mt-1 text-xs text-slate-400 line-clamp-1">{s.desc}</p>
                      </div>
                    </div>
                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                      <span>{s.action}</span>
                      <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="mt-16 overflow-hidden rounded-3xl bg-white p-2 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)] ring-1 ring-slate-100">
              <iframe
                src="https://maps.google.com/maps?q=9.025,38.747&z=14&output=embed"
                width="100%"
                height="480"
                style={{ borderRadius: "1rem" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="የኮሚሽኑ ካርታ"
              />
            </div>

          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
