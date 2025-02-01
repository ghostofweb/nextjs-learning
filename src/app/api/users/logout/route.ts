import { connectDb } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";

connectDb();

export async function GET(req: NextRequest) {
  try {
    const response = NextResponse.json({
      status: "success",
      message: "Logout successful",
    });

    // Clear the token cookie
    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0), // Immediately expire
      path: "/", // Ensure cookie is cleared from all paths
    });

    return response;

  } catch (error: any) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { status: "error", message: error.message || "Logout failed" },
      { status: 500 }
    );
  }
}