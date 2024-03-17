// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
  text,
  integer
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `spotify_data_${name}`);

// export const posts = createTable(
//   "post",
//   {
//     id: serial("id").primaryKey(),
//     name: varchar("name", { length: 256 }),
//     createdAt: timestamp("created_at")
//       .default(sql`CURRENT_TIMESTAMP`)
//       .notNull(),
//     updatedAt: timestamp("updatedAt"),
//   },
//   (example) => ({
//     nameIndex: index("name_idx").on(example.name),
//   })
// );

export const users = createTable(
  "users",
  {
    id: text("id").primaryKey(),
    spotifyId: text("spotify_id").unique(),
    username: text("username"),
    avatar: text("avatar"),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
  }
)

export const sessions = createTable("sessions", {
	id: text("id").primaryKey(),
	userId: text("user_id")
    .notNull()
    .references(() => users.id),
	expiresAt: timestamp("expires_at", {
		withTimezone: true,
		mode: "date"
	}).notNull()
});

export const songHistory = createTable("song_history", {
  id: serial("id").primaryKey(),
  spotifyId: text("spotify_id").notNull(),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  artistId: text("artist_id").notNull(),
  artistCover: text("artist_art").notNull(),
  cover: text("art").notNull(),
  playedBy: text("played_by").references(() => users.id).notNull(),
  playedAt: timestamp("played_at", {
    mode: "date",
    withTimezone: true,
  }).notNull(),
  endAt: timestamp("end_at", {
    mode: "date",
    withTimezone: true
  }).notNull()
})

export const artistImages = createTable("artist_images", {
  id: serial("id").primaryKey(),
  spotifyArtistId: text("spotify_artist_id").notNull(),
  image: text("image").notNull()
})