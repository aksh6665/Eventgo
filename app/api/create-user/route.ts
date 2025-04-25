import { createUser } from '@/lib/actions/user.actions'
import { connectToDatabase } from '@/lib/database'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    await connectToDatabase()
    
    const newUser = await createUser({
      clerkId: 'user_2w6nvrLiQt3Osim2rDQ5K0GcxKW', // Your Clerk User ID
      email: 'akshayssp30@gmail.com',
      username: 'akshay',
      firstName: 'Akshay',
      lastName: 'Sri Sai',
      photo: 'https://images.clerk.dev/oauth_google/img_2w6nvsRgpajgP8dPRCUkGYK3LG6'
    })

    return NextResponse.json({
      message: 'User created successfully',
      user: newUser
    })

  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ 
      message: 'Error creating user', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
