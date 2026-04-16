import { NextResponse } from "next/server";
import { busRoutes } from "@/lib/data/kfupm-data";

export async function GET() {
  return NextResponse.json({ data: busRoutes });
}
