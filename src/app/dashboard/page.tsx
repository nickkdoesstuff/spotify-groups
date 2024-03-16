import { Button } from "@/components/ui/button"
import { getUser } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default async function DashboardHome() {
    const user = await getUser()
    return (
        <>
            <img src={user?.avatar} className="h-12 w-12 rounded-full mx-auto" />
            <h1 className="font-bold text-2xl text-center">{user?.username}</h1>
        </>
    )
}