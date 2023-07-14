"use client"
import { UserButton } from "@clerk/nextjs";

export default function UserInfo() {
    return (
        <div>
            <UserButton afterSignOutUrl="/" />
        </div>
    )
}