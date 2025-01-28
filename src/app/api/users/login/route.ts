import { connectDb } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/helpers/mailer";
import bcryptjs from "bcryptjs";
connectDb();

export default async function POST(req:NextRequest){
    try {
        const reqBody = await req.json();
        const {email,password} = reqBody;
        console.log(email,password);
        const user = await User.findOne({email})
        if(!user){
            return NextResponse.json({status:"error",message:"User not found"},{status:404})
        }
        const validPassword = await bcryptjs.compare(password,user.password) // Compare password and we get a boolean value in return
        
        if(!validPassword){
            return NextResponse.json({status:"error",message:"Invalid password"},{status:401})
        }
    } catch (error:any) {
        return NextResponse.json({status:"error",message:error.message},{status:500})
    }
}
