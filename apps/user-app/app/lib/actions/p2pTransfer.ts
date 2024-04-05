'use server'

import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import db from '@repo/db/client'

export async function P2PTransfer(to: string, amount: number) {
    const session = await getServerSession(authOptions);

    const fromUserId = session?.user?.id;

    if (!fromUserId) {
        return {
            message: 'Unauthenticated request',
        }
    }

    const toUser = await db.user.findFirst({
        where: {
            number: to,
        }
    });

    if (!toUser) {
        return {
            message: 'User not found',
        }
    }

    const toUserId = toUser?.id;

    await db.$transaction(async (tx) => {
        await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(fromUserId)} FOR UPDATE;`

        const fromBalance = await tx.balance.findUnique({
            where: {
                userId: Number(fromUserId),
            }
        });

        if (!fromBalance || fromBalance.amount < amount) {
            throw new Error('Insufficient funds')
        }

        await tx.balance.update({
            where: {
                userId: Number(fromUserId),
            },
            data: {
                amount: {
                    decrement: amount
                }
            }
        })

        await tx.balance.update({
            where: {
                userId: toUserId,
            },
            data: {
                amount: {
                    increment: amount
                }
            }
        })

        await tx.p2PTransfers.create({
            data: {
                amount: amount,
                fromUserId: Number(fromUserId),
                toUserId: toUserId,
                timestamp: new Date(),
            }
        })
        
    });
}