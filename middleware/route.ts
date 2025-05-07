import { NextRequest,NextResponse } from "next/server";
import jwt from 'jsonwebtoken'

const secret = process.env.SECRET as string

export async function Middleware(req:NextRequest){

    const token = req.headers.get("Authorization")?.split(" ")[1]

    try{

        if(!token){
            return NextResponse.json({
                msg:"No token provided"
            },{
                status:401
            })
        }
    
        const decode = jwt.verify(token, secret);
        if (!decode || typeof decode === "string") {
            return NextResponse.json({
                msg: "Token not verified"
            });
        }

        const response = NextResponse.next();
        response.headers.set("x-user-id", decode.id || "");
        return response;

    }catch(e){
        return NextResponse.json({
            msg:(e as Error).toString()
        })
    }

}