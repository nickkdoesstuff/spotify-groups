import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getUser } from "@/lib/auth"
import { db } from "@/server/db"
import { eq } from "drizzle-orm"
import { songHistory } from "@/server/db/schema"
import type { User } from "lucia";
import { RecentlyPlayedClient } from "./RecentlyPlayedClient"

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
        <RecentlyPlayedClient lastPlayed={lastPlayed} user={user!} isProfile={isProfile} />
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