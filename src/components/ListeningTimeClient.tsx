"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { User } from "lucia";
import { useEffect, useState } from "react"
import { api } from "@/trpc/react"
import BarGraph from "./ListeningTime/graph";

interface TimesArray {
    name: string,
    value: number
}

interface RecentlyPlayedClientProps {
    totalTime: number;
    times: TimesArray[]
    isProfile: boolean
    user: User
}

export function ListeningTimeClient({ totalTime, times, user, isProfile }: RecentlyPlayedClientProps) {

    const [timeInMins, setTimeInMins] = useState<number>(totalTime)
    const [timeData, setTimeData] = useState<typeof times>(times)

    const { data } = api.spotify.time.useQuery({ userId: user.id }, { refetchInterval: 30000, refetchOnWindowFocus: true })

    useEffect(() => {
        if(data) {
            setTimeInMins(data.totalTime)
            setTimeData(data.times)
        }
    }, [setTimeInMins, setTimeData, data])

    return (
        <Card className="w-full">
        <CardHeader>
            <CardTitle>Listening Time</CardTitle>
            <CardDescription>How long {isProfile ? `${user.username} has` : <span>you&apos;ve</span>} spent listening this week</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="font-bold text-2xl mb-6">{timeInMins} <span className="font-normal text-muted-foreground text-sm">minutes this week</span></p>
            <BarGraph times={timeData} />
        </CardContent>
       </Card>
    )
}