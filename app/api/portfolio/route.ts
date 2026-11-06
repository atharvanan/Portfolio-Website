import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getPortfolioData, savePortfolioData } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

// Force dynamic execution so Next.js & Vercel never cache this route statically
export const dynamic = "force-dynamic";

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

async function handleUpdate(req: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized. Please log in again." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const result = await savePortfolioData(body);

    // Revalidate public homepage immediately
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

export async function PUT(req: Request) {
  return handleUpdate(req);
}

export async function POST(req: Request) {
  return handleUpdate(req);
}
