import connectMongoDB from "@/libs/mongodb";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
   const { user } = await req.json()
   const { name, email, role } = user
   try {
      await connectMongoDB()
      const userExists = await User.findOne({ email })
      if (!userExists) {
         await User.create({ name, email, role })
      }
      // Log the login event
      const apiUrl = process.env.API_URL
      await fetch(`${apiUrl}/api/log`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({ email }),
      })
      return NextResponse.json({ success: true })
   } catch (error) {
      console.error(error)
      return NextResponse.json(
         { success: false, error: 'Internal Server Error' },
         { status: 500 }
      )
   }
}