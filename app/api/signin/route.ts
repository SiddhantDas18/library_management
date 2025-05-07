import { NextRequest,NextResponse } from "next/server";
import prismaClient from "@/app/lib/db";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const secret = process.env.SECRET as string

export async function POST(req:NextRequest) {
    
    const request = await req.json()

    const {username,password} = await request

    try{

        const findUser = await prismaClient.users.findFirst({
            where:{
                username: username
            }
        })
    
        if(!findUser){
            return NextResponse.json({
                msg:"User not found"
            })
        }

        const hashed_password = findUser?.password
        const checkpass = await bcrypt.compare(password,hashed_password)

        if(!checkpass){
            return NextResponse.json({
                msg:"Password not matched"
            })
        }

        const id = findUser?.id

        const token = jwt.sign({
            id
        },secret)

        return NextResponse.json({
            msg:"SignedUp successful",
            token:token
        })

    }catch(e){
        return NextResponse.json({
            msg:(e as Error).toString()
        })
    }

    
}