import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getPortfolioData, savePortfolioData } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  try {
    const data = await getPortfolioData();
    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch portfolio data" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const result = await savePortfolioData(body);

    // Revalidate the public homepage immediately so live static visitors get updated content instantly!
    revalidatePath("/");

    return NextResponse.json({
      success: true,
      message: "Portfolio updated successfully",
      storage: result.storage,
    });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message || "Failed to save portfolio data" },
      { status: 500 }
    );
  }
}

