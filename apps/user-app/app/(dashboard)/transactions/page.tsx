import { getServerSession } from "next-auth"
import { P2PTransactions, TransactionType } from "../../../components/P2PTransactions"
import { authOptions } from "../../lib/auth"
import prisma from '@repo/db/client'

async function getP2PTransactions(): Promise<{
    time: Date,
    amount: number,
    transactionType: TransactionType,
}[]> {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
        throw new Error('Unauthorized request');
    }

    const transfers = await prisma.p2PTransfers.findMany({
        where: {
            OR: [
                {
                    fromUserId: Number(userId),
                },
                {
                    toUserId: Number(userId),
                }
            ]
        }
    })

    return transfers.map((t) => ({
        time: t.timestamp,
        amount: Number(t.amount),
        transactionType: t.fromUserId == userId ? TransactionType.Send : TransactionType.Received,
    }))
}

export default async function () {
    const transactions = await getP2PTransactions();
    return <div className="w-screen">
        <div className="p-8 grid grid-cols-1 md:grid-cols-2">
            <P2PTransactions transactions={transactions}>

            </P2PTransactions>
        </div>
    </div>
}