import { NextResponse } from "next/server";
import { parkingLots, parkingSlots, sensors } from "@/lib/data/kfupm-data";

export async function GET(_: Request, { params }: { params: { lotId: string } }) {
  const lot = parkingLots.find((item) => item.id === params.lotId);

  if (!lot) {
    return NextResponse.json({ error: "Lot not found" }, { status: 404 });
  }

  return NextResponse.json({
    data: {
      lot,
      slots: parkingSlots.filter((slot) => slot.lotId === lot.id),
      sensors: sensors.filter((sensor) => sensor.lotId === lot.id)
    }
  });
}
