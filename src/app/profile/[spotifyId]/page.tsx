import { db } from "@/server/db"
import { users } from "@/server/db/schema"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { RecentlyPlayed, RecentlyPlayedLoading } from "@/components/RecentlyPlayed"
import { ListeningTime, ListeningTimeLoading } from "@/components/ListeningTime"
import { MostPlayed, MostPlayedLoading } from "@/components/MostPlayed"
import type { User } from "lucia"
import type { Metadata } from "next"
import { generateMetadata as genMeta } from "@/lib/utils"
import { ProfileCard } from "@/components/ProfileCard"
import { MostPlayedArtists, MostPlayedArtistsLoading } from "@/components/MostPlayedArtists"
import { DateWrapper } from "@/components/DateWrapper"
import { DateControls } from "@/components/DateControls"

export async function generateMetadata({ params }: { params: { spotifyId: string } }):Promise<Metadata> {
    const userList = await db.select().from(users).where(
        eq(users.spotifyId, params.spotifyId)
    )

    if(userList.length == 0){
        return genMeta({ title: '404 not found', description: 'This profile does not exist' })
    }

    const user = userList[0]!

    return genMeta({ title: `${user.username}'s profile` })
}

export default async function Profile({ params }: { params: { spotifyId: string } }) {

    const userList = await db.select().from(users).where(
        eq(users.spotifyId, params.spotifyId)
    )

    if(userList.length == 0) return notFound()
    const user = userList[0]

    return (
        <DateWrapper>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <ProfileCard user={user as User} isProfile />
                <DateControls />
                <Suspense fallback={<RecentlyPlayedLoading />}>
                    <RecentlyPlayed user={user as User} isProfile />
                </Suspense>
                <Suspense fallback={<ListeningTimeLoading />}>
                    <ListeningTime user={user as User} isProfile />
                </Suspense>
                <Suspense fallback={<MostPlayedLoading />}>
                    <MostPlayed user={user as User} isProfile />
                </Suspense>
                <Suspense fallback={<MostPlayedArtistsLoading />}>
                    <MostPlayedArtists user={user as User} isProfile />
                </Suspense>
            </div>
        </DateWrapper>

    )
}