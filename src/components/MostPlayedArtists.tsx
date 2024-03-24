import { getUser } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { db } from "@/server/db";
import { songHistory } from "@/server/db/schema";
import { and, eq, gte } from "drizzle-orm";
import { startOfWeek } from "date-fns";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";
import { User } from "lucia";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { MicVocal } from "lucide-react";

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
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Top Artists</CardTitle>
                <CardDescription>{isProfile ? `${user?.username}'s` : 'Your'} most listened to artists this weeek</CardDescription>
            </CardHeader>
            <CardContent>
            {topSongs.length > 0 && 
                <ScrollArea className="h-[385px] flex flex-col">
                    {topSongs.map(track => {
                        return (
                            <Card key={track.id} className={cn(topSongs[topSongs.length - 1] != track && "mb-2")}>
                                <CardContent className="p-3">
                                    <div className="flex gap-2 items-center">
                                    <Avatar>
                                            <AvatarImage src={track.artistCover} />
                                            <AvatarFallback><MicVocal /></AvatarFallback>
                                        </Avatar>                                        <div className="flex flex-col gap-2">
                                            <CardTitle>{track.artist}</CardTitle>
                                            <CardDescription>Played <strong>{track.occurrences}</strong> times</CardDescription>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                    </ScrollArea>
            }
            {topSongs.length == 0 &&
                <div className="h-[385px] flex justify-center items-center">
                    <p className="text-muted-foreground">Nothing to see - yet!</p>
                </div>
            }
            </CardContent>
        </Card>
    )
}

export function MostPlayedArtistsLoading() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Most Listened To</CardTitle>
                <CardDescription>Your most listened to songs this weeek</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[385px] flex items-center justify-center">
                    <p>Loading...</p>
                </div>
            </CardContent>
        </Card>
    )
}