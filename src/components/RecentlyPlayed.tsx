import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getUser } from "@/lib/auth"
import { db } from "@/server/db"
import { eq } from "drizzle-orm"
import { songHistory } from "@/server/db/schema"
import { format, formatDistance } from "date-fns"
import { ScrollArea } from "./ui/scroll-area"
import { cn } from "@/lib/utils"
import { User } from "lucia";
import { HoverCardContent, HoverCard, HoverCardTrigger } from "./ui/hover-card"
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar"
import { MicVocal, Music2 } from "lucide-react"

interface RecentlyPlayedProps {
    user?: User | null
    isProfile?: boolean
}

export async function RecentlyPlayed({ user, isProfile }: RecentlyPlayedProps) {
    if(!user) {
        user = await getUser()
    }

    if(!isProfile) {
        isProfile = false
    }

    const lastPlayed = await db.query.songHistory.findMany({
        where: eq(songHistory.playedBy, user!.id),
        limit: 10,
        orderBy: (songHistory, { desc }) => [desc(songHistory.playedAt)]
    })
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Last 10 Songs</CardTitle>
                <CardDescription>The most recent songs {isProfile ? `${user?.username} has been` : <span>you&apos;ve been</span>} listening to</CardDescription>
            </CardHeader>
            <CardContent>
                {lastPlayed.length > 0 && 
                <ScrollArea className="h-[385px] flex flex-col">
                    {lastPlayed.map(track => {
                        return (
                            <Card key={track.id} className={cn(lastPlayed[lastPlayed.length - 1] != track && "mb-2")}>
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

                {lastPlayed.length == 0 && 
                    <div className="h-[385px] flex justify-center items-center">
                        <p className="text-muted-foreground">Nothing to see - yet!</p>
                    </div>
                }
            </CardContent>
        </Card>
    )
}

export function RecentlyPlayedLoading() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Last 10 Songs</CardTitle>
                <CardDescription>The most recent songs you&apos;ve been listening to</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[385px] flex items-center justify-center">
                    <p>Loading...</p>
                </div>
            </CardContent>
        </Card>
    )
}