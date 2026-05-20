import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import SkinReport from "@/lib/models/SkinReport";

/**
 * API Route Handler to retrieve all saved skin diagnostic history.
 * Supports patient dashboards and historic comparisons.
 */
export async function GET(req: Request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email") || "anonymous_patient@dermavision.ai";

    // Retrieve active patient records, newest first
    const reports = await SkinReport.find({ userEmail: email })
      .sort({ createdAt: -1 })
      .select("-imageUrl") // Exclude heavy raw images to optimize query response sizing
      .limit(10);

    return NextResponse.json({ success: true, reports });

  } catch (error: any) {
    console.error("Clinical Server Error fetching reports list:", error);
    return NextResponse.json(
      { error: "Failed to load clinical report list.", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * API Route Handler to delete a specific report document.
 */
export async function DELETE(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing required parameter: id" }, { status: 400 });
    }

    await SkinReport.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Report wiped successfully." });

  } catch (error: any) {
    console.error("Clinical Server Error deleting report:", error);
    return NextResponse.json(
      { error: "Failed to delete clinical record.", details: error.message },
      { status: 500 }
    );
  }
}
