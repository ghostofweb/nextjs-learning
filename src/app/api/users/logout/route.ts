import { connectDb } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connectDb();

export async function POST(req: NextRequest) {
    // Clear cookie
   try {
     const response = NextResponse.json({
         status: "success",
         message: "User logged out",
     });
 
     response.cookies.set("token", "", {
         httpOnly: true,
         expires: new Date(0),
     });
     
     return response;
 
   } catch (error) {
       console.error(error);
       return NextResponse.json(
           { status: "error", message: "An error occurred" },
           { status: 500 }
       );
   }
    
}