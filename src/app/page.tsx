import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";



export default async function Home() {
  const user = await getUser()

  if (user != null){
    return redirect("/dashboard")
  }
  
  return (
    <main className="flex justify-center items-center h-[100vh] w-[100vw]">
      <Card className="max-w-[400px] w-full m-2">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>You&apos;ll need to login with <strong>Spotify</strong> to access this service. You can only login if added to the user&apos;s list by Nick.</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/login"><Button className="w-full">Sign in with Spotify</Button></Link>
        </CardContent>
      </Card>
    </main>
  );
}


