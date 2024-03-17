import { generateState } from "arctic";
import { spotify } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET(): Promise<Response> {
	const state = generateState();
	const url = await spotify.createAuthorizationURL(state, { scopes: ['user-read-recently-played'] });

	cookies().set("spotify_oauth_state", state, {
		path: "/",
		secure: process.env.NODE_ENV === "production",
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: "lax"
	});

	return Response.redirect(url);
}