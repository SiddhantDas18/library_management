import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt'
import prismaClient from "@/app/lib/db";




export async function POST(req: NextRequest) {

    const request = await req.json();
    const { user, password, email } = request;
    const hashedPassword = bcrypt.hash(password, 10)
    const role = "user"

    try {

        const check_user = await prismaClient.users.findFirst({
            where: {
                username: user
            }
        })
        if (check_user) {
            return NextResponse.json({
                msg: "User name already taken"
            })
        }



        const createUser = await prismaClient.users.create({
            data: {
                username: user,
                password: await hashedPassword,
                email: email,
                role: role
            }
        })

        return NextResponse.json({
            msg: "Haha you are here",
            user: createUser
        })

    } catch (e) {
        return NextResponse.json({
            error: (e as Error).toString()
        })
    }


}