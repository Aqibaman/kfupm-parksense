import { NextResponse } from "next/server";
import { generateRecommendation } from "@/lib/engines/recommendations";
import { getDemoUser } from "@/lib/services/query";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const destination = searchParams.get("destination") ?? "Building 64";
  const duration = Number(searchParams.get("duration") ?? "3");
  const user = getDemoUser(searchParams.get("userId") ?? undefined);

  return NextResponse.json({
    data: generateRecommendation({
      user,
      destination,
      expectedDurationHours: duration
    })
  });
}
