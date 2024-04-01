"use client"

import { Loader2, MicVocal } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { ScrollArea } from "./ui/scroll-area"
import { cn } from "@/lib/utils"
import type { User } from "lucia"
import type { songHistory } from "@/server/db/schema"
import { useContext, useEffect, useState } from "react"
import { api } from "@/trpc/react"
import { DateContext } from "./DateWrapper"

type SongsPlayed = typeof songHistory.$inferSelect
interface TopSongs extends SongsPlayed {
    occurrences: number
}

interface MostPlayedArtistsClientProps {
    isProfile: boolean;
    user: User;
    topSongs: TopSongs[]
}

export function MostPlayedArtistsClient({ isProfile, topSongs, user }: MostPlayedArtistsClientProps) {

    const [topArtists, setTopArtists] = useState<typeof topSongs>(topSongs)
    const { date } = useContext(DateContext)

    const { data, isLoading } = api.spotify.topArtists.useQuery({ userId: user.id, date: date! }, { refetchInterval: 30000, refetchOnWindowFocus: true })

    useEffect(() => {
        if (data) {
            setTopArtists(data)
        }
    }, [data, setTopArtists])

    return (
        <Card className="w-full">
            <CardHeader className="relative">
                <CardTitle>Top Artists</CardTitle>
                <CardDescription>{isProfile ? `${user.username}'s` : 'Your'} most listened to artists this week</CardDescription>
                {isLoading && <Loader2 className="h-4 w-4 top-4 right-4 absolute text-muted-foreground animate-spin" />}
            </CardHeader>
            <CardContent>
            {topArtists.length > 0 && 
                <ScrollArea className="h-[385px] flex flex-col">
                    {topArtists.map(track => {
                        return (
                            <Card key={track.id} className={cn(topArtists[topArtists.length - 1] != track && "mb-2")}>
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
            {topArtists.length == 0 &&
                <div className="h-[385px] flex justify-center items-center">
                    <p className="text-muted-foreground">Nothing to see - yet!</p>
                </div>
            }
            </CardContent>
        </Card>
    )
}