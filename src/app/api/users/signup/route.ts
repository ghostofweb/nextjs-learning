import { connectDb } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { stat } from "fs";
import {NextRequest,NextResponse} from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";
connectDb();

export async function POST(req: NextRequest) {
    try {
        const reqBody = await req.json() //Get the request body need to put await because it is a promise 
        const {username,email,password} = reqBody;
        //Validate the request body
        console.log(reqBody);
        const user = await User.findOne({email});
        if(user){
            return NextResponse.json({
                status: "error",
                message: "User already exists"
            }),
            {status: 400}
        }
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password,salt);
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })
        const savedUser = await newUser.save();
        await sendEmail({email,emailType:"Verify",userId:savedUser._id});
        //Send email to user to verify email address 
        return NextResponse.json({
            status: "success",
            message: "User created successfully",
            savedUser
        },
        {status: 201})
        
    } catch (error:any) {
        return NextResponse.json({
            status: "error",
            message: error.message,
            
        })
    }
}