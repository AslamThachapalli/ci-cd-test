'use client'
import { Card } from "@repo/ui/card";
import { TextInput } from "@repo/ui/textinput";
import { Button } from "@repo/ui/button";
import { Center } from "@repo/ui/center";
import { useState } from "react";
import { P2PTransfer } from "../app/lib/actions/p2pTransfer";

export function SendCard(){
    const [number, setNumber] = useState('');
    const [amount, setAmount] = useState('');

    return <div className="h-[90vh]">
        <Center>
            <Card title="Send">
                <div className="min-w-72 pt-2">
                    <TextInput label={"Number"} placeholder={"1234567890"} onChange={(e) => {
                        setNumber(e);
                    }} />
                    <TextInput label={"Amount"} placeholder={"Amount"} onChange={(e) => {
                        setAmount(e);
                    }} />
                    <div className="flex justify-center pt-4">
                        <Button onClick={() => {
                            P2PTransfer(number, Number(amount) * 100)
                        }}>
                            Send
                        </Button>
                    </div>
                </div>
            </Card>
        </Center>
    </div>
}