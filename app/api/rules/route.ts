import { NextResponse } from "next/server";
import { parkingRules } from "@/lib/data/kfupm-data";

export async function GET() {
  return NextResponse.json({ data: parkingRules });
}
