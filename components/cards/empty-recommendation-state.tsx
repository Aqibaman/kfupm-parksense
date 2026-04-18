import { MapPinned } from "lucide-react";
import { Card } from "@/components/ui/card";

export function EmptyRecommendationState({ title, description }: { title: string; description: string }) {
  return (
    <Card className="border-dashed border-[#cfe4d8] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbf8_100%)]">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#dff6e7_0%,#eef8f2_100%)] text-[#008540]">
          <MapPinned className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[#0f172a]">{title}</h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p>
        </div>
      </div>
    </Card>
  );
}
