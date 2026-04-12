import dynamic from "next/dynamic";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

const OraclePageClient = dynamic(
  () => import("@/app/oracle/OraclePageClient").then((mod) => ({ default: mod.OraclePageClient })),
  {
    ssr: false,
    loading: () => <LoadingScreen />,
  },
);

export default function OraclePage() {
  return <OraclePageClient />;
}
