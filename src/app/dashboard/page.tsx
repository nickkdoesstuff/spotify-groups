import { getUser } from "@/lib/auth"
import { RecentlyPlayed, RecentlyPlayedLoading } from "@/components/RecentlyPlayed"
import { Suspense } from "react"
import { ListeningTime , ListeningTimeLoading} from "@/components/ListeningTime"
import { MostPlayed, MostPlayedLoading } from "@/components/MostPlayed"

export default async function DashboardHome() {
    const user = await getUser()

    return (
        <>
            <img src={user?.avatar} className="h-12 w-12 rounded-full mx-auto" />
            <h1 className="font-bold text-2xl text-center">{user?.username}</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Suspense fallback={<RecentlyPlayedLoading />}>
                    <RecentlyPlayed />
                </Suspense>
                <Suspense fallback={<ListeningTimeLoading />}>
                    <ListeningTime />
                </Suspense>
                <Suspense fallback={<MostPlayedLoading />}>
                    <MostPlayed />
                </Suspense>
            </div>
        </>
    )
}