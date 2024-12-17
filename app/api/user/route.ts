import User from '@/models/user'
import connectMongoDB from '@/libs/mongodb'
import { NextRequest, NextResponse } from 'next/server'
export async function POST(request: NextRequest) {
   try {
      const { name, email, role } = await request.json() // 입력 유효성 검사
      if (!name || !email || !role) {
         return NextResponse.json(
            { error: 'Name and email are required' },
            { status: 400 }
         )
      }// 이메일 형식 검사
      if (!/^\S+@\S+\.\S+$/.test(email)) {
         return NextResponse.json(
            { error: 'Invalid email format' },
            { status: 400 }
         )
      } await connectMongoDB()
      const user = await User.create({ name, email, role })
      return NextResponse.json(
         { message: 'User registered', user },
         { status: 201 }
      )
   } catch (error) {
      console.error('Error registering user:', error)
      return NextResponse.json(
         { error: 'Failed to register user' },
         { status: 500 }
      )
   }
}