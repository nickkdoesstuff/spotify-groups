"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { User } from "lucia";
import { useContext, useEffect, useState } from "react"
import { api } from "@/trpc/react"
import BarGraph from "./ListeningTime/graph";
import { DateContext } from "./DateWrapper";
import { Loader2 } from "lucide-react";

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
    const { date } = useContext(DateContext)

    const { data, isLoading } = api.spotify.time.useQuery({ userId: user.id, date: date! }, { refetchInterval: 30000, refetchOnWindowFocus: true })

    useEffect(() => {
        if(data) {
            setTimeInMins(data.totalTime)
            setTimeData(data.times)
        }
    }, [setTimeInMins, setTimeData, data])

    return (
        <Card className="w-full">
        <CardHeader className="relative">
            <CardTitle>Listening Time</CardTitle>
            <CardDescription>How long {isProfile ? `${user.username} has` : <span>you&apos;ve</span>} spent listening this week</CardDescription>
            {isLoading && <Loader2 className="h-4 w-4 top-4 right-4 absolute text-muted-foreground animate-spin" />}

        </CardHeader>
        <CardContent>
            <p className="font-bold text-2xl mb-6">{timeInMins} <span className="font-normal text-muted-foreground text-sm">minutes this week</span></p>
            <BarGraph times={timeData} />
        </CardContent>
       </Card>
    )
}