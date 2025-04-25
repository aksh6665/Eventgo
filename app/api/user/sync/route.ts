import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import User from "@/lib/database/models/user.model";

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    
    // Get current user from Clerk
    const clerkUser = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    }).then(res => res.json());

    if (!clerkUser) {
      return NextResponse.json({ error: "User not found in Clerk" }, { status: 404 });
    }

    // Find or create user in MongoDB
    let mongoUser = await User.findOne({ clerkId: userId });

    if (!mongoUser) {
      // Create new user
      mongoUser = await User.create({
        clerkId: userId,
        email: clerkUser.email_addresses[0].email_address,
        firstName: clerkUser.first_name || '',
        lastName: clerkUser.last_name || '',
        username: clerkUser.username || '',
        photo: clerkUser.image_url || '',
      });
    } else {
      // Update existing user
      mongoUser.firstName = clerkUser.first_name || mongoUser.firstName;
      mongoUser.lastName = clerkUser.last_name || mongoUser.lastName;
      mongoUser.photo = clerkUser.image_url || mongoUser.photo;
      mongoUser.username = clerkUser.username || mongoUser.username;
      await mongoUser.save();
    }

    return NextResponse.json({
      message: "User synced successfully",
      user: mongoUser
    });

  } catch (error) {
    console.error("Error syncing user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 