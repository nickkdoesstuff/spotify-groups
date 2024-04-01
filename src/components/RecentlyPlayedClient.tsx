"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { songHistory } from "@/server/db/schema"
import { format, formatDistance, startOfWeek } from "date-fns"
import { ScrollArea } from "./ui/scroll-area"
import { cn } from "@/lib/utils"
import type { User } from "lucia";
import { HoverCardContent, HoverCard, HoverCardTrigger } from "./ui/hover-card"
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar"
import { Loader2, MicVocal, Music2 } from "lucide-react"
import { useContext, useEffect, useState } from "react"
import { api } from "@/trpc/react"
import { DateContext } from "./DateWrapper";

interface RecentlyPlayedClientProps {
    lastPlayed: typeof songHistory.$inferSelect[]
    isProfile: boolean
    user: User
}

export function RecentlyPlayedClient({ lastPlayed, user, isProfile }: RecentlyPlayedClientProps) {

    const [tracks, setTracks] = useState<typeof lastPlayed>(lastPlayed)
    const {date} = useContext(DateContext)

    const { data, isLoading } = api.spotify.recent.useQuery({ userId: user.id }, { refetchInterval: 30000, refetchOnWindowFocus: true })

    const startOfWeekTime = startOfWeek(new Date(), { weekStartsOn: 1 })
    const dateStartOfWeekTime = startOfWeek(date!, { weekStartsOn: 1 })

    useEffect(() => {
        console.log(data)
        if(data) {
            setTracks(data)
        }
    }, [setTracks, data])

    return (
        <Card className={cn("w-full transition-opacity", startOfWeekTime.getTime() != dateStartOfWeekTime.getTime() && "opacity-50")}>
            <CardHeader className="relative">
                <CardTitle>Last 10 Songs</CardTitle>
                <CardDescription>The most recent songs { isProfile ? `${user.username} has been` : <span>you&apos;ve been</span>} listening to</CardDescription>
                {isLoading && <Loader2 className="h-4 w-4 top-4 right-4 absolute text-muted-foreground animate-spin" />}
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