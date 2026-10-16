import Link from "next/link";
import { Menubar } from "@/components/menubar";
import { Footer } from "@/components/footer";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <Menubar />
      <main className="flex min-h-[70vh] flex-col items-center justify-center bg-white px-4 pt-24 text-center">
        <div className="max-w-md">
          <p className="text-sm font-bold uppercase tracking-wider text-[#014BAA]">404 ስህተት</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            ገጹ አልተገኘም
          </h1>
          <p className="mt-4 text-base text-slate-600">
            የፈለጉት ገጽ አልተገኘም ወይም ተንቀሳቅሷል። እባክዎ ወደ መነሻ ገጽ ይመለሱ።
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-[#014BAA] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#013b86]"
            >
              <Home className="size-4" />
              ወደ መነሻ ገጽ
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
