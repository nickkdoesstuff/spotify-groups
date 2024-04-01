import { RecentlyPlayed, RecentlyPlayedLoading } from "@/components/RecentlyPlayed"
import { Suspense } from "react"
import { ListeningTime , ListeningTimeLoading} from "@/components/ListeningTime"
import { MostPlayed, MostPlayedLoading } from "@/components/MostPlayed"
import { ProfileCard } from "@/components/ProfileCard"
import { MostPlayedArtists, MostPlayedArtistsLoading } from "@/components/MostPlayedArtists"

export default async function DashboardHome() {
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
            <Suspense fallback={<MostPlayedArtistsLoading />}>
                <MostPlayedArtists />
            </Suspense>
        </div>
    )
}