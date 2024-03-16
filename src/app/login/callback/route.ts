import { spotify, lucia } from "@/lib/auth";
import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";
import { generateId } from "lucia";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";

export async function GET(request: Request): Promise<Response> {
	const url = new URL(request.url);
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");
	const storedState = cookies().get("spotify_oauth_state")?.value ?? null;
	if (!code || !state || !storedState || state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	try {
		const tokens = await spotify.validateAuthorizationCode(code);
		const spotifyUserResponse = await fetch("https://api.spotify.com/v1/me", {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});

        if (spotifyUserResponse.status != 200) {
            return new Response(null, {
                status: 400
            });
        }

		const spotifyUser: SpotifyUser = await spotifyUserResponse.json();

		// Replace this with your own DB client.
		const existingUser = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.spotifyId, spotifyUser.id)
        })

		if (existingUser) {
			const session = await lucia.createSession(existingUser.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
			return new Response(null, {
				status: 302,
				headers: {
					Location: "/dashboard"
				}
			});
		}

        const userId = generateId(15)

		// Replace this with your own DB client.
		const newUser = await db.insert(users).values({
            id: userId,
            username: spotifyUser.display_name,
            avatar: spotifyUser.images[0]?.url,
            spotifyId: spotifyUser.id,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        }).returning()

		const session = await lucia.createSession(newUser[0]!.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
		return new Response(null, {
			status: 302,
			headers: {
				Location: "/dashboard"
			}
		});
	} catch (e) {
		// the specific error message depends on the provider
		if (e instanceof OAuth2RequestError) {
			// invalid code
			return new Response(null, {
				status: 400
			});
		}
		return new Response(null, {
			status: 500
		});
	}
}

interface SpotifyUser {
	id: string;
	display_name: string;
    images: {
        url: string
    }[];
}