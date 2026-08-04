import { NextResponse } from "next/server";

import { parseLeadFields } from "@/lib/lead";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = parseLeadFields(body);

  if (!result.success) {
    return NextResponse.json(
      { message: "Check the required details and try again.", errors: result.errors },
      { status: 400 },
    );
  }

  return NextResponse.json({ received: true });
}
