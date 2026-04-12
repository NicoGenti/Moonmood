import dynamic from "next/dynamic";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

const HistoryPageClient = dynamic(
  () => import("@/app/history/HistoryPageClient").then((mod) => ({ default: mod.HistoryPageClient })),
  {
    ssr: false,
    loading: () => <LoadingScreen />,
  },
);

export default function HistoryPage() {
  return <HistoryPageClient />;
}
