import { connectDb } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

connectDb();

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { username, email, password } = reqBody;

    // Validate input format
    if (!email.includes("@") || password.length < 6) {
      return NextResponse.json(
        { status: "error", message: "Invalid email or password format" },
        { status: 400 }
      );
    }

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { status: "error", message: "User already exists" },
        { status: 409 } // More appropriate status code
      );
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create user
    const newUser = new User({ username, email, password: hashedPassword });
    const savedUser = await newUser.save();

    // Send verification email
    await sendEmail({
      email,
      emailType: "VERIFY",
      userId: savedUser._id.toString(), // Convert ObjectId to string
    });

    return NextResponse.json(
      {
        status: "success",
        message: "Registration successful. Please check your email.",
        data: {
          id: savedUser._id,
          email: savedUser.email,
          username: savedUser.username,
        },
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "An error occurred during registration",
      },
      { status: 500 } // Always specify status code
    );
  }
}