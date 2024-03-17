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
        <div className={`max-w-[750px] mx-auto mt-2 p-2`}>
          {children}
        </div>
    );
  }