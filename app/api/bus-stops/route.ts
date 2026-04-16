import { NextResponse } from "next/server";
import { busStops } from "@/lib/data/kfupm-data";

export async function GET() {
  return NextResponse.json({ data: busStops });
}
