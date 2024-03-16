import { lucia, validateRequest } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request: Request): Promise<Response> {
    const { session } = await validateRequest()
    if (!session) {
		return new Response(null, {
            status: 302,
            headers: {
                Location: "/dashboard"
            }
        });
	}

    await lucia.invalidateSession(session.id)
    const sessionCookie = lucia.createBlankSessionCookie();
	cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

	return new Response(null, {
        status: 302,
        headers: {
            Location: "/dashboard"
        }
    });
}

