import type { User } from "lucia";
import { getUser } from "@/lib/auth";
import { db } from "@/server/db";
import { startOfWeek, addDays  } from "date-fns";
import { and, eq, gte } from "drizzle-orm";
import { songHistory } from "@/server/db/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

import { ListeningTimeClient } from "./ListeningTimeClient";
interface TimesArray {
    name: string,
    value: number
}

interface ListeningTimeProps {
    user?: User | null
    isProfile?: boolean
}

export async function ListeningTime({ user, isProfile }: ListeningTimeProps) {
    if(!user) {
        user = await getUser()
    }

    if(!isProfile) {
        isProfile = false
    }

    let totalTime = 0

    const mondayStartDate = startOfWeek(new Date(), { weekStartsOn: 1 })
    const tuesdayStartDate = addDays(mondayStartDate, 1)
    const wednesdayStartDate = addDays(mondayStartDate, 2)
    const thursdayStartDate = addDays(mondayStartDate, 3)
    const fridayStartDate = addDays(mondayStartDate, 4)
    const saturdayStartDate = addDays(mondayStartDate, 5)
    const sundayStartDate = addDays(mondayStartDate, 6)

    const times: TimesArray[] = [{ name: "monday", value: 0 }, { name: "tuesday", value: 0 }, { name: "wednesday", value: 0 }, { name: "thursday", value: 0 }, { name: "friday", value: 0 }, { name: "saturday", value: 0 }, { name: "sunday", value: 0 }]

    const playedToday = await db.select().from(songHistory).where(
        and(
            eq(songHistory.playedBy, user!.id),
            gte(songHistory.playedAt, mondayStartDate)
        )
    )

    for (const track of playedToday) {
        // track starts on X DAY
        const trackTime = (new Date(track.endAt).getTime() - new Date(track.playedAt).getTime())

        if (track.playedAt >= mondayStartDate && track.playedAt < tuesdayStartDate) {
            times[0]!.value += trackTime
        } else if(track.playedAt >= tuesdayStartDate && track.playedAt < wednesdayStartDate) {
            times[1]!.value += trackTime
        } else if(track.playedAt >= wednesdayStartDate && track.playedAt < thursdayStartDate) {
            times[2]!.value += trackTime
        } else if(track.playedAt >= thursdayStartDate && track.playedAt < fridayStartDate) {
            times[3]!.value += trackTime
        } else if(track.playedAt >= fridayStartDate && track.playedAt < saturdayStartDate) {
            times[4]!.value += trackTime
        } else if(track.playedAt >= saturdayStartDate && track.playedAt < sundayStartDate) {
            times[5]!.value += trackTime
        } else if(track.playedAt >= sundayStartDate) {
            times[6]!.value += trackTime
        }


        totalTime += trackTime
    }

    const timeInMins = Math.floor(totalTime / 60000)


    return (
        <ListeningTimeClient isProfile={isProfile} user={user!} totalTime={timeInMins} times={times} />
    )
}

export function ListeningTimeLoading() {
    return (
        <Card className="w-full">
         <CardHeader>
             <CardTitle>Listening Time</CardTitle>
             <CardDescription>How long you&apos;ve spent listening this week</CardDescription>
         </CardHeader>
         <CardContent className="h-[380px] flex justify-center items-center">
            <p>Loading...</p>
         </CardContent>
        </Card>
     )
}