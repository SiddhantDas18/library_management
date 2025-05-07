import { NextRequest, NextResponse } from "next/server";
import { Middleware } from "@/middleware/route";
import prismaClient from "@/app/lib/db";

interface Books{
    title:string,
    author:string,
    ISBN:string,
    Published_year:String,
    Copies_available:number
}


export async function POST(req: NextRequest) {

    try {



        const authentication = await Middleware(req)

        if (authentication.status == 401) {
            return NextResponse.json({
                authentication
            })
        }

        const user_id = authentication.headers.get("x-user-id");

        const findAdmin = await prismaClient.users.findUnique({
            where:{
                id:Number(user_id),
                role:"admin"
            }
        })

        if(!findAdmin){
            return NextResponse.json({
                msg:"You are not authorized to add books"
            })
        }

        const { title, author, ISBN, Published_year, Copies_available }:Books = await req.json()

        if (title == null || author == null || Published_year == null || Copies_available == null || ISBN == null) {
            return NextResponse.json({
                msg: "Add all the inputs"
            })
        }

        try {
            const addBooks = await prismaClient.books.create({
                data: {
                    title: title,
                    author: author,
                    ISBN: ISBN,
                    Published_year: String(Published_year),
                    Copies_availabe: Copies_available
                }
            })

            return NextResponse.json({
                msg:"Book Added successfull",
                book:addBooks
            })


        } catch (e) {
            return NextResponse.json({
                message:"Can't add the book",
                msg: (e as Error).toString()
            })
        }
    } catch (e) {
        return NextResponse.json({
            msg: (e as Error).toString()
        })
    }

}