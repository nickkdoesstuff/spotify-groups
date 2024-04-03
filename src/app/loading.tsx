import { Loader2 } from "lucide-react"

export default function LoadingPage() {
    return (
        <div className="flex items-center justify-center h-[100vh] w-full">
            <Loader2 className="h-4 w-4 animate-spin" />
        </div>
    )
}