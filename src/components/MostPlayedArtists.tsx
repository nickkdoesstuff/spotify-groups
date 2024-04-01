import { getUser } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { db } from "@/server/db";
import { songHistory } from "@/server/db/schema";
import { and, eq, gte } from "drizzle-orm";
import { startOfWeek } from "date-fns";
import type { User } from "lucia";
import { MostPlayedArtistsClient } from "./MostPlayedArtistsClient";

interface MostPlayedProps {
    user?: User | null
    isProfile?: boolean
}

export async function MostPlayedArtists({ user, isProfile }: MostPlayedProps) {
    if(!user) {
        user = await getUser()
    }

    if(!isProfile) {
        isProfile = false
    }

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
        if(song.artistId in occurrencesMap) {
            occurrencesMap[song.artistId]++
        } else {
            occurrencesMap[song.artistId] = 1
        }
    })

    const sortedIds = Object.keys(occurrencesMap).sort((a, b) => occurrencesMap[b]! - occurrencesMap[a]!);
    const topSongs: TopSongs[]  = []
    for (let i = 0; i < 10; i++) {
        const id = sortedIds[i]
        const object = songsPlayed.find(obj => obj.artistId == id)
        if(object) {
            topSongs.push({ occurrences: occurrencesMap[id!]!, ...object })
        }
    }

    return (
       <MostPlayedArtistsClient isProfile={isProfile} topSongs={topSongs} user={user!} />
    )
}

export function MostPlayedArtistsLoading() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Most Listened To</CardTitle>
                <CardDescription>Your most listened to songs this week</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[385px] flex items-center justify-center">
                    <p>Loading...</p>
                </div>
            </CardContent>
        </Card>
    )
}