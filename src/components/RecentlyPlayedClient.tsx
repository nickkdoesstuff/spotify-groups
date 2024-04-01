"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { songHistory } from "@/server/db/schema"
import { format, formatDistance } from "date-fns"
import { ScrollArea } from "./ui/scroll-area"
import { cn } from "@/lib/utils"
import type { User } from "lucia";
import { HoverCardContent, HoverCard, HoverCardTrigger } from "./ui/hover-card"
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar"
import { MicVocal, Music2 } from "lucide-react"
import { useEffect, useState } from "react"
import { api } from "@/trpc/react"

interface RecentlyPlayedClientProps {
    lastPlayed: typeof songHistory.$inferSelect[]
    isProfile: boolean
    user: User
}

export function RecentlyPlayedClient({ lastPlayed, user, isProfile }: RecentlyPlayedClientProps) {

    const [tracks, setTracks] = useState<typeof lastPlayed>(lastPlayed)

    const { data } = api.spotify.recent.useQuery({ userId: user.id }, { refetchInterval: 30000, refetchOnWindowFocus: true })

    useEffect(() => {
        console.log(data)
        if(data) {
            setTracks(data)
        }
    }, [setTracks, data])

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Last 10 Songs</CardTitle>
                <CardDescription>The most recent songs { isProfile ? `${user.username} has been` : <span>you&apos;ve been</span>} listening to</CardDescription>
            </CardHeader>
            <CardContent>
                {tracks.length > 0 && 
                <ScrollArea className="h-[385px] flex flex-col">
                    {tracks.map(track => {
                        return (
                            <Card key={track.id} className={cn(tracks[tracks.length - 1] != track && "mb-2")}>
                                <CardContent className="p-3">
                                    <div className="flex gap-2 items-center">
                                        <Avatar>
                                            <AvatarImage src={track.cover} />
                                            <AvatarFallback><Music2 /></AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col gap-2">
                                            <CardTitle>{track.title}</CardTitle>
                                            <HoverCard>
                                                <HoverCardTrigger asChild>
                                                    <CardDescription className="flex items-center">{track.artist} &bull; {formatDistance(new Date(track.playedAt), new Date(), { addSuffix: true })}</CardDescription>
                                                </HoverCardTrigger>
                                                <HoverCardContent>
                                                <Avatar className="h-full w-full">
                                                    <AvatarImage src={track.artistCover} className="w-full h-full" />
                                                    <AvatarFallback><MicVocal /></AvatarFallback>
                                                </Avatar>
                                                    <p className="text-muted-foreground text-xs">{track.artist} &bull; Played at {format(track.playedAt, 'dd/MM/yy HH:mm')}</p>
                                                </HoverCardContent>
                                            </HoverCard>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                    )
                })}
                </ScrollArea>
                }

                {tracks.length == 0 && 
                    <div className="h-[385px] flex justify-center items-center">
                        <p className="text-muted-foreground">Nothing to see - yet!</p>
                    </div>
                }
            </CardContent>
        </Card>
    )
}