import { MapPin, ParkingCircle, SquareArrowOutUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";

export function SlotActionBar({
  lotName,
  floorLabel,
  slotLabel,
  onParked,
  onLeft,
  disabled = false,
  locationState
}: {
  lotName: string;
  floorLabel: string;
  slotLabel: string;
  onParked: () => void;
  onLeft: () => void;
  disabled?: boolean;
  locationState: "idle" | "capturing" | "captured" | "denied" | "fallback";
}) {
  const locationText =
    locationState === "capturing"
      ? "Capturing your parked location..."
      : locationState === "captured"
        ? "Location captured for bus-stop guidance."
        : locationState === "fallback"
          ? "Using lot location because precise GPS was unavailable."
          : locationState === "denied"
            ? "Location permission was denied. Guidance will use lot-level fallback."
            : "Your parked location will be captured when you confirm.";

  return (
    <Card className="border-[#cde8dd] bg-[linear-gradient(180deg,#ffffff_0%,#f7fcf9_100%)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#008540]">Selected slot</p>
          <h3 className="mt-2 text-lg font-semibold text-[#003E51]">{slotLabel}</h3>
          <p className="mt-1 text-sm text-slate-600">
            {lotName} · {floorLabel}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onParked}
            disabled={disabled}
            className="inline-flex items-center gap-2 rounded-full bg-[#008540] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(0,133,64,0.18)] transition hover:bg-[#0a7742] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ParkingCircle className="h-4 w-4" />
            I parked
          </button>
          <button
            type="button"
            onClick={onLeft}
            className="inline-flex items-center gap-2 rounded-full bg-[#0b5b72] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(0,62,81,0.16)] transition hover:bg-[#08495b]"
          >
            <SquareArrowOutUpRight className="h-4 w-4" />
            I left
          </button>
        </div>
      </div>
      <div className="mt-4 rounded-2xl border border-[#dbe9e1] bg-[#f9fcfa] px-4 py-3 text-sm text-slate-600">
        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-4 w-4 text-[#008540]" />
          <p>{locationText}</p>
        </div>
      </div>
    </Card>
  );
}
