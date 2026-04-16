import { NextResponse } from "next/server";
import { parkingLots } from "@/lib/data/kfupm-data";

export async function GET() {
  return NextResponse.json({ data: parkingLots });
}
