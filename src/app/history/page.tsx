import { MoodHistory } from "@/components/mood/MoodHistory";

export default function HistoryPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-5 px-4 py-10 sm:px-6">
      <header className="space-y-2 text-center sm:text-left">
        <p className="text-xs uppercase tracking-wider text-white/45">Moonmood</p>
        <h1 className="font-display text-3xl font-bold text-white">Le tue memorie</h1>
        <p className="text-sm text-white/65">Rileggi il tuo cammino emotivo, una memoria alla volta.</p>
      </header>

      <MoodHistory />
    </main>
  );
}
