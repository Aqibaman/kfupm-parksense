import { NextResponse } from "next/server";
import { buses } from "@/lib/data/kfupm-data";

export async function GET() {
  return NextResponse.json({ data: buses });
}
