import { connectDb } from "@/dbConfig/dbConfig";
import { dataFromToken } from "@/helpers/dataFromToken";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connectDb();

export async function GET(req:NextRequest){
    try {
        // extract data from token
       const userId =  await dataFromToken(req);
       const user = await User.findOne({_id:userId}).select("-password")
       // check if there is no user
       return NextResponse.json({
        message:"User Found",
        data: user
       })
    } catch (error) {
        throw new Error("User Not Found")
    }
}