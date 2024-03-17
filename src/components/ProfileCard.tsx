import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getUser } from "@/lib/auth"
import { db } from "@/server/db"
import { count, eq } from "drizzle-orm"
import { songHistory } from "@/server/db/schema"
import { formatDistance } from "date-fns"
import { ScrollArea } from "./ui/scroll-area"
import { cn } from "@/lib/utils"
import { User } from "lucia";
import { Button } from "./ui/button"
import ShareModal from "./ProfileCard/modal"


interface ProfileCardProps {
    user?: User | null
    isProfile?: boolean
}

export async function ProfileCard({ user, isProfile }: ProfileCardProps) {
    if(!user) {
        user = await getUser()
    }

    if(!isProfile) {
        isProfile = false
    }

    const allSongsCount = await db.select({ count: count() }).from(songHistory).where(eq(songHistory.playedBy, user!.id))
    return (
        <Card className="col-span-1 sm:col-span-2">
            <CardContent className="p-6">
                <div className="flex flex-col gap-2 items-center sm:flex-row sm:justify-between">
                    <div className="flex flex-row gap-2 items-center">
                        <img src={user!.avatar} className="h-16 w-16 rounded-full" />
                        <div>
                            <CardTitle className="text-2xl">{user!.username} <span className="font-normal text-xs text-muted-foreground">({user!.spotifyId.toUpperCase()})</span></CardTitle>
                            <CardDescription>{allSongsCount[0]?.count} all-time songs played</CardDescription>
                        </div>
                    </div>
                    {!isProfile && <ShareModal username={user!.spotifyId} />}
                </div>
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