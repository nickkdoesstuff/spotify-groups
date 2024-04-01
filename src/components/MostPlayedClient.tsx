"use client";

import { Music2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import type { songHistory } from "@/server/db/schema";
import type { User } from "lucia";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { useEffect, useState } from "react";

type SongsPlayed = typeof songHistory.$inferSelect
interface TopSongs extends SongsPlayed {
    occurrences: number
}

interface MostPlayedClientProps {
    isProfile: boolean;
    user: User;
    topSongs: TopSongs[]
}

export function MostPlayedClient({ isProfile, user, topSongs }: MostPlayedClientProps) {

    const [topList, setTopList] = useState<typeof topSongs>(topSongs)

    const { data } = api.spotify.topSongs.useQuery({ userId: user.id }, { refetchInterval: 30000, refetchOnWindowFocus: true })

    useEffect(() => {
        if (data) {
            setTopList(data)
        }
    }, [data, setTopList])

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Most Played</CardTitle>
                <CardDescription>{isProfile ? `${user?.username}'s` : 'Your'} most listened to songs this week</CardDescription>
            </CardHeader>
            <CardContent>
            {topList.length > 0 && 
                <ScrollArea className="h-[385px] flex flex-col">
                    {topList.map(track => {
                        return (
                            <Card key={track.id} className={cn(topList[topList.length - 1] != track && "mb-2")}>
                                <CardContent className="p-3">
                                    <div className="flex gap-2 items-center">
                                        <Avatar>
                                            <AvatarImage src={track.cover} />
                                            <AvatarFallback><Music2 /></AvatarFallback>
                                        </Avatar>
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
            }
            {topList.length == 0 &&
                <div className="h-[385px] flex justify-center items-center">
                    <p className="text-muted-foreground">Nothing to see - yet!</p>
                </div>
            }
            </CardContent>
        </Card>
    )
}