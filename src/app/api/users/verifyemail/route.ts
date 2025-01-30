import { connectDb } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connectDb();
export async function POST(req:NextRequest){
    try {
        const reqBody = await req.json();
        const {token} = reqBody;
        console.log(token);
        const user = await User.findOne({verifyToken:token,verifyTokenExpiry:{$gt:Date.now()}})
        if (!user) {
            return NextResponse.json({status:"error",message:"Invalid or expired token"},{status:400})
        }
        console.log(user);
        user.isVerified = true; // Update user's isVerified field
        user.verifyToken = undefined; // Remove token from user document after verification is complete 
        user.verifyTokenExpire = undefined; // Remove token expiry date from user document after verification is complete
        
        await user.save(); // Save updated user document, also await to ensure save completes
        return NextResponse.json({status:"success",message:"Email verified successfully"},{status:200})
        

    } catch (error:any) {
        return NextResponse.json({status:"error",message:error.message},{status:500})
    }
}