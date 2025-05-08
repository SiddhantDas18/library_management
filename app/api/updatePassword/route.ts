import { NextResponse, NextRequest } from "next/server";
import prismaClient from "@/app/lib/db";
import { Middleware } from "@/middleware/route";
import bcrypt from "bcrypt";



export async function PATCH(req:NextRequest){
    try{

        const authentication = await Middleware(req)

        if(authentication.status == 401){
            return NextResponse.json({  
                msg:"Unauthorized"
            })
        }

        const {password,newPassword} = await req.json()
        
        if(password == null || newPassword == null){
            return NextResponse.json({
                msg:"Password is required"
            })
        }

        const user_id = authentication.headers.get("x-user-id")

        if(!user_id || isNaN(Number(user_id))){
            return NextResponse.json({
                msg:"Invalid user id"
            })
        }

        const findUser = await prismaClient.users.findUnique({
            where:{
                username:user_id
            }
        })

        if(!findUser){
            return NextResponse.json({
                msg:"User not found"
            })
        }

        const passCheck = await bcrypt.compare(password,findUser.password)

        if(!passCheck){
            return NextResponse.json({
                msg:"Invalid Password"
            })
        }

        try{
            const newHashed_password = await bcrypt.hash(newPassword,10)

            const updatePassword = await prismaClient.users.update({
                where:{
                    id:Number(user_id)
                },data:{
                    password:newHashed_password
                }
            })

            return NextResponse.json({
                msg:"Password updated successfully"
            })

        }catch(e){
            return NextResponse.json({
                msg:(e as Error).toString()
            })
        }
        
    }catch(e){
        return NextResponse.json({
            msg:(e as Error).toString()
        })
    }
}