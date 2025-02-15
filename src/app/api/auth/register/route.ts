import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { mongoDbConnection } from "@/app/lib/mongoose/DbConnection";
import { User } from "@/models";

export async function POST(request: Request) {
  await mongoDbConnection();

  try {
    // ✅ Read raw text before parsing JSON
    const bodyText = await request.text();
    console.log("📩 Raw request body:", bodyText); 

    let parsedBody;
    try {
      parsedBody = JSON.parse(bodyText);
    } catch (error) {
      console.error("❌ JSON Parsing Error:", error);
      return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
    }

    const { username, email, password } = parsedBody;

    if (!username || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return NextResponse.json({
      message: "User registered successfully",
      success: true,
      userId: newUser._id,
    });
  } catch (error: any) {
    console.error("🔥 Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
