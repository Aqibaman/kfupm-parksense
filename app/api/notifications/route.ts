import { NextResponse } from "next/server";
import { notifications } from "@/lib/data/kfupm-data";

export async function GET() {
  return NextResponse.json({ data: notifications });
}
