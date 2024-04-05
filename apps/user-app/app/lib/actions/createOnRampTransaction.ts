"use server"

import db from "@repo/db/client"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth";

export async function createOnRampTransaction(amount: number, provider : string) {
    console.log('ramping');
    const session = await getServerSession(authOptions);
    if(!session?.user || !session.user?.id){
        return {
            message: 'Unauthenticated request',
        }
    }
    const userId = session?.user?.id;
    console.log(userId)

    const token = (Math.random() * 1000).toString();

    await db.onRampTransaction.create({
        data: {
            provider,
            status: "Processing",
            amount: amount * 100,
            token,
            startTime: new Date(),
            userId: Number(userId)
        }
    })

    return {
        message: "Done",
    }
}