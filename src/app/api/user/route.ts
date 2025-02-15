import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
// import User from '@/models/user';
import { mongoDbConnection } from '@/app/lib/mongoose/DbConnection';
import { User } from '@/models';
// import { mongoDbConnection } from '@/lib/mongodb';

export async function POST(request: Request) {
    try {
      await mongoDbConnection();
      const { username, email, password } = await request.json(); // Extract username too
  
      if (!username || !email || !password) {
        return NextResponse.json(
          { error: 'All fields (username, email, password) are required' },
          { status: 400 }
        );
      }
  
      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json(
          { error: 'User already exists' },
          { status: 400 }
        );
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create new user
      const newUser = new User({
        username, // Add username
        email,
        password: hashedPassword
      });
  
      await newUser.save();
  
      return NextResponse.json({
        message: 'User created successfully',
        success: true,
        userId: newUser._id
      });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
  }
  