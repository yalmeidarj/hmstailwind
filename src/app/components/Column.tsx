"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data. e.g we want our id to be string and status none other than these four options
export type Payment = {
    id: string
    amount: number
    status: "pending" | "processing" | "success" | "failed"
    email: string
}

export const columns: ColumnDef<Payment>[] = [
    //we can set normal fields like this
    {
        accessorKey: "status",
        header: "Status",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    //
    {
        accessorKey: "amount",
        header: () => <div className="text-right">Amount</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("amount"))
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount)

            //we can format the amount in any currency without any use of external package

            return <div className="text-right font-medium">{formatted}</div>
        },
    },
]
