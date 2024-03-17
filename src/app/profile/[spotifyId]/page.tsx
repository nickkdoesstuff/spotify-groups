import { db } from "@/server/db"
import { users } from "@/server/db/schema"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { RecentlyPlayed, RecentlyPlayedLoading } from "@/components/RecentlyPlayed"
import { ListeningTime, ListeningTimeLoading } from "@/components/ListeningTime"
import { MostPlayed, MostPlayedLoading } from "@/components/MostPlayed"
import { User } from "lucia"

export default async function Profile({ params }: { params: { spotifyId: string } }) {

    const userList = await db.select().from(users).where(
        eq(users.spotifyId, params.spotifyId)
    )

    if(userList.length == 0) return notFound()
   const user = userList[0]

    return (
        <>
            <img src={user!.avatar!} className="h-12 w-12 rounded-full mx-auto" />
            <h1 className="font-bold text-2xl text-center">{user?.username}&apos;s profile</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Suspense fallback={<RecentlyPlayedLoading />}>
                    <RecentlyPlayed user={user as User} isProfile />
                </Suspense>
                <Suspense fallback={<ListeningTimeLoading />}>
                    <ListeningTime user={user as User} isProfile />
                </Suspense>
                <Suspense fallback={<MostPlayedLoading />}>
                    <MostPlayed user={user as User} isProfile />
                </Suspense>
            </div>
        </>
    )
}