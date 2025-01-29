import { connectDb } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connectDb();

export async function POST(req: NextRequest) {
    try {
        const reqBody = await req.json();
        const { email, password } = reqBody;
        
        // Validate user exists
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { status: "error", message: "User not found" },
                { status: 400 }
            );
        }

        // Validate password
        const validPassword = await bcryptjs.compare(password, user.password);
        if (!validPassword) {
            return NextResponse.json(
                { status: "error", message: "Invalid password" },
                { status: 401 }
            );
        }

        // Check if TOKEN_SECRET is defined
        const tokenSecret = process.env.TOKEN_SECRET;
        if (!tokenSecret) {
            throw new Error("TOKEN_SECRET environment variable is not set");
        }

        // Create token data
        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email,
        };

        // Generate token with expiration
        const token = jwt.sign(tokenData, tokenSecret,
            {expiresIn: "1d"}
        );

        const response = NextResponse.json({
            status: "success",
            message: "User logged in",
        })

        // Set token in cookie
        response.cookies.set("token", token,{
            httpOnly:true,
            expires: new Date(Date.now() + 86400000),
        });

        return response;

    } catch (error: any) {
        return NextResponse.json(
            { status: "error", message: error.message },
            { status: 500 }
        );
    }
}