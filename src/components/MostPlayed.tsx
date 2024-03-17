import { getUser } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { db } from "@/server/db";
import { songHistory } from "@/server/db/schema";
import { and, eq, gte } from "drizzle-orm";
import { startOfWeek } from "date-fns";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";

export async function MostPlayed() {
    const user = await getUser()

    const songsPlayed = await db.select().from(songHistory)
        .where(
            and(
                eq(songHistory.playedBy, user!.id),
                gte(songHistory.playedAt, startOfWeek(new Date(), { weekStartsOn: 1 }))
            )
        )
    
    const occurrencesMap: Record<string, number> = {};

    type SongsPlayed = typeof songsPlayed[0]
    interface TopSongs extends SongsPlayed {
        occurrences: number
    }

    songsPlayed.forEach(song => {
        if(song.spotifyId in occurrencesMap) {
            occurrencesMap[song.spotifyId]++
        } else {
            occurrencesMap[song.spotifyId] = 1
        }
    })

    const sortedIds = Object.keys(occurrencesMap).sort((a, b) => occurrencesMap[b]! - occurrencesMap[a]!);
    const topSongs: TopSongs[]  = []
    for (let i = 0; i < 10; i++) {
        const id = sortedIds[i]
        const object = songsPlayed.find(obj => obj.spotifyId == id)
        if(object) {
            topSongs.push({ occurrences: occurrencesMap[id!]!, ...object })
        }
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Most Listened To</CardTitle>
                <CardDescription>Your most listened to songs this weeek</CardDescription>
            </CardHeader>
            <CardContent>
            <ScrollArea className="h-[385px] flex flex-col">
                {topSongs.map(track => {
                    return (
                        <Card key={track.id} className={cn(topSongs[topSongs.length - 1] != track && "mb-2")}>
                            <CardContent className="p-3">
                                <div className="flex gap-2 items-center">
                                    <img src={track.cover} className="rounded-lg h-16 w-16" />
                                    <div className="flex flex-col gap-2">
                                        <CardTitle>{track.title}</CardTitle>
                                        <CardDescription>{track.artist} &bull; Played <strong>{track.occurrences}</strong> times</CardDescription>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
                </ScrollArea>
            </CardContent>
        </Card>
    )
}