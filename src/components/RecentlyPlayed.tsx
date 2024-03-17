import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getUser } from "@/lib/auth"
import { db } from "@/server/db"
import { eq } from "drizzle-orm"
import { songHistory } from "@/server/db/schema"
import { formatDistance } from "date-fns"
import { ScrollArea } from "./ui/scroll-area"
import { cn } from "@/lib/utils"
import { User } from "lucia";


export async function RecentlyPlayed() {
    const user = await getUser()

    const lastPlayed = await db.query.songHistory.findMany({
        where: eq(songHistory.playedBy, user!.id),
        limit: 10,
        orderBy: (songHistory, { desc }) => [desc(songHistory.playedAt)]
    })
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Last 10 Songs</CardTitle>
                <CardDescription>The most recent songs you&apos;ve been listening to</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[385px] flex flex-col">
                {lastPlayed.map(track => {
                    return (
                        <Card key={track.id} className={cn(lastPlayed[lastPlayed.length - 1] != track && "mb-2")}>
                            <CardContent className="p-3">
                                <div className="flex gap-2 items-center">
                                    <img src={track.cover} className="rounded-lg h-16 w-16" />
                                    <div className="flex flex-col gap-2">
                                        <CardTitle>{track.title}</CardTitle>
                                        <CardDescription>{track.artist} &bull; {formatDistance(new Date(track.playedAt), new Date(), { addSuffix: true })}</CardDescription>
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