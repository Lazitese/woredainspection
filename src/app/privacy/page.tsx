import { Menubar } from "@/components/menubar";
import { Footer } from "@/components/footer";

export default function PrivacyPolicy() {
  return (
    <>
      <Menubar />
      <main className="min-h-screen bg-slate-50 pt-24 pb-16">
        <section className="container-site relative z-10 flex flex-col items-center py-10">
          <div className="max-w-3xl w-full">
            <h1 className="font-heading text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-6">
              የግላዊነት ፖሊሲ
            </h1>
            <div className="rounded-3xl bg-white p-8 sm:p-12 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)] ring-1 ring-slate-100">
              <p className="text-slate-600">በቅርቡ ይካተታል (Coming soon)...</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
