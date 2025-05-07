import { NextResponse, NextRequest } from "next/server";
import prismaClient from "@/app/lib/db";
import { Middleware } from "@/middleware/route";


export async function PATCH(req: NextRequest) {

    try {

        const authentication = await Middleware(req)
        

        if (authentication.status == 401) {
            return NextResponse.json({
                authentication
            })

        }

        const { email } = await req.json();

        const user_id = authentication.headers.get("x-user-id");

        if (!user_id || isNaN(Number(user_id))) {
            return NextResponse.json({
                error: "Invalid or missing user ID"
            });
        }

        const findUser = await prismaClient.users.findUnique({
            where: {
                id: Number(user_id)
            }
        });

        if(!findUser){
            return NextResponse.json({
                msg:"User Not found"
            })
        }

        try{
            const updateEmail = await prismaClient.users.update({
                where:{
                    id: parseInt(user_id)
                },data:{
                    email:email
                }
            })

            return NextResponse.json({
                msg:"Email updated successfully",
                updateEmail:updateEmail
            },{status:200})

        }catch(e){

            return NextResponse.json({
                msg:(e as Error).toString()
            })
        }

    } catch (e) {
        return NextResponse.json({
            msg: (e as Error).toString()
        })
    }


}