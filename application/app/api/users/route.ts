import { NextResponse } from 'next/server';
import { User } from '@/lib/models/User';
import mongoose from 'mongoose';
import { connectToDB } from '@/lib/mongodb';

// GET handler to fetch user details
export async function GET(request: Request) {
  try {
    await connectToDB();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST handler to create new user
export async function POST(request: Request) {
  try {
    await connectToDB();
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await User.create({ email });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
    console.log(error);
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }
    console.log(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT handler to add coin to user's portfolio
export async function PUT(request: Request) {
  try {
    await connectToDB();
    const { email, coin } = await request.json();

    if (!email || !coin) {
      return NextResponse.json({ error: 'Email and coin details are required' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    user.portfolio.push(coin);
    await user.save();

    return NextResponse.json(user);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
