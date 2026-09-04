"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { navLinks } from "@/lib/site-data";

const submissionLinks = [
  { label: "ጥቆማ", href: "/tikoma" },
  { label: "አቤቱታ", href: "/abetuta" },
];

const socialPlatforms = [
  { 
    name: "Facebook", 
    nameAm: "ፌስቡክ", 
    href: "https://www.facebook.com/share/1Ejo7j8cf2/", 
    color: "#1877F2",
    icon: (
      <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    )
  },
  { 
    name: "TikTok", 
    nameAm: "ቲክቶክ", 
    href: "https://www.tiktok.com", 
    color: "#000000",
    icon: (
      <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-3.04-1.52z" />
      </svg>
    )
  },
  { 
    name: "WhatsApp", 
    nameAm: "ዋትስአፕ", 
    href: "https://wa.me/251111243462", 
    color: "#25D366",
    icon: (
      <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
      </svg>
    )
  },
  { 
    name: "Twitter (X)", 
    nameAm: "ትዊተር", 
    href: "https://x.com", 
    color: "#000000",
    icon: (
      <svg className="size-3.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    )
  },
  { 
    name: "Telegram", 
    nameAm: "ቴሌግራም", 
    href: "https://t.me", 
    color: "#229ED9",
    icon: (
      <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    )
  },
];

export function Footer() {
  const year = "2018";

  return (
    <footer className="relative bg-slate-950">
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{ backgroundColor: "#FFB800" }}
        aria-hidden="true"
      />

      <div className="container-site py-14 sm:py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {/* 1. Brand + Mission + Social Icons */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="relative size-11 overflow-hidden rounded-full ring-2 ring-[#FFB800]/50">
                <Image src="/logo.jpg" alt="የአቃቂ ቃሊቲ ክ/ከተማ ብልጽግና የኢንስፔክሽንና የስነ ምግባር ኮሚሽን ምልክት" fill className="object-cover" />
              </div>
              <div>
                <p className="text-sm font-bold leading-tight text-white">የአቃቂ ቃሊቲ ክ/ከተማ ብልጽግና</p>
                <p className="text-xs font-medium leading-tight text-slate-400">የኢንስፔክሽንና የስነ ምግባር ኮሚሽን ፅ/ቤት</p>
              </div>
            </Link>
            <p className="mt-4 text-sm font-semibold text-slate-400">
              ጠንካራ ኢንስፔክሽን ፤ ለጠንካራ ፓርቲ!
            </p>
            <div className="mt-6 flex items-center gap-2.5">
              {socialPlatforms.map((s) => (
                <Link
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-10 items-center justify-center rounded-xl bg-slate-900 text-slate-400 shadow-sm ring-1 ring-slate-800 transition-all duration-300 hover:-translate-y-0.5 hover:text-white"
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = s.color; e.currentTarget.style.borderColor = s.color; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#0f172a"; e.currentTarget.style.borderColor = "#1e293b"; }}
                  aria-label={s.name}
                  title={`${s.name} (${s.nameAm})`}
                >
                  {s.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* 2. Quick Links */}
          <div className="flex gap-10 sm:gap-16">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "#FFB800" }}>
                ምናሌ
              </h3>
              <ul className="mt-4 space-y-2.5" role="list">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "#FFB800" }}>
                ማቅረቢያ
              </h3>
              <ul className="mt-4 space-y-2.5" role="list">
                {submissionLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 3. Contact Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "#FFB800" }}>
              አግኙን
            </h3>
            <ul className="space-y-3.5 text-sm text-slate-400" role="list">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0" style={{ color: "#FFB800" }} aria-hidden="true" />
                <span>አዲስ አበባ፣ ኢትዮጵያ</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 size-4 shrink-0" style={{ color: "#FFB800" }} aria-hidden="true" />
                <div>
                  <p>+251 111 243 462</p>
                  <p className="text-xs text-slate-500">ክ/ከተማ ፅ/ቤት</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 size-4 shrink-0" style={{ color: "#FFB800" }} aria-hidden="true" />
                <a
                  href="mailto:ppinspectioncommission@gmail.com"
                  className="transition-colors hover:text-white truncate"
                  style={{ direction: "ltr" }}
                >
                  ppinspectioncommission@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="mt-0.5 size-4 shrink-0" style={{ color: "#FFB800" }} aria-hidden="true" />
                <span>ሰኞ - አርብ፣ 2:30 - 11:30</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between border-t border-slate-800 pt-8 gap-4">
          <p className="text-xs text-slate-500 text-center sm:text-left">
            &copy; {year} የአቃቂ ቃሊቲ ክ/ከተማ ብልጽግና የኢንስፔክሽንና የስነ ምግባር ኮሚሽን ፅ/ቤት። ሁሉም መብቱ የተጠበቀ ነው።
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">የግላዊነት ፖሊሲ</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-slate-400 transition-colors">የአጠቃቀም ደንቦች</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
