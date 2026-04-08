import { Suspense } from "react";

import { HistoryPageClient } from "@/app/history/HistoryPageClient";

export default function HistoryPage() {
  return (
    <Suspense fallback={null}>
      <HistoryPageClient />
    </Suspense>
  );
}
