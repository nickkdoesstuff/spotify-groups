import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {

    const user = await getUser()

    if(!user) {
        redirect("/")
    }

    return (
        <div className={`max-w-[640px] mx-auto mt-2`}>
          {children}
        </div>
    );
  }