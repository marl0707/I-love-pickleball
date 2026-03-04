import { NextRequest, NextResponse } from "next/server";
import { getRankedAdBids } from "@/lib/ad-bids";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category") || "All";

        const bids = await getRankedAdBids(category);

        return NextResponse.json({ success: true, data: { bids } });
    } catch (error) {
        console.error("GET /api/ad-bids error:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
