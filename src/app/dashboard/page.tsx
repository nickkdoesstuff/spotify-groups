import { getUser } from "@/lib/auth"
import { RecentlyPlayed, RecentlyPlayedLoading } from "@/components/RecentlyPlayed"
import { Suspense } from "react"
import { ListeningTime , ListeningTimeLoading} from "@/components/ListeningTime"
import { MostPlayed, MostPlayedLoading } from "@/components/MostPlayed"
import { ProfileCard } from "@/components/ProfileCard"

export default async function DashboardHome() {
    const user = await getUser()

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <ProfileCard />
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
    )
}