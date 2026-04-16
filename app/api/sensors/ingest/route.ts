import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  return NextResponse.json({
    status: "accepted",
    message: "Mock sensor ingestion endpoint received payload. Replace this handler with a live ESP32 or Raspberry Pi ingestion workflow later.",
    receivedAt: new Date().toISOString(),
    payload
  });
}
