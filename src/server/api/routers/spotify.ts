import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { songHistory } from "@/server/db/schema";
import { and, eq, gte } from "drizzle-orm";
import { addDays, startOfWeek } from "date-fns";

interface TimesArray {
  name: string,
  value: number
}

export const spotifyRouter = createTRPCRouter({
  recent: publicProcedure
      .input(z.object({ userId: z.string() }))
      .query(async ({ input }) => {
          const lastPlayed = await db.query.songHistory.findMany({
              where: eq(songHistory.playedBy, input.userId),
              limit: 10,
              orderBy: (songHistory, { desc }) => [desc(songHistory.playedAt)]
          })

          return lastPlayed
  }),

  time: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      let totalTime = 0

      const mondayStartDate = startOfWeek(new Date(), { weekStartsOn: 1 })
      const tuesdayStartDate = addDays(mondayStartDate, 1)
      const wednesdayStartDate = addDays(mondayStartDate, 2)
      const thursdayStartDate = addDays(mondayStartDate, 3)
      const fridayStartDate = addDays(mondayStartDate, 4)
      const saturdayStartDate = addDays(mondayStartDate, 5)
      const sundayStartDate = addDays(mondayStartDate, 6)

      const times: TimesArray[] = [{ name: "monday", value: 0 }, { name: "tuesday", value: 0 }, { name: "wednesday", value: 0 }, { name: "thursday", value: 0 }, { name: "friday", value: 0 }, { name: "saturday", value: 0 }, { name: "sunday", value: 0 }]

      const playedToday = await db.select().from(songHistory).where(
          and(
              eq(songHistory.playedBy, input.userId),
              gte(songHistory.playedAt, mondayStartDate)
          )
      )

      for (const track of playedToday) {
          // track starts on X DAY
          const trackTime = (new Date(track.endAt).getTime() - new Date(track.playedAt).getTime())

          if (track.playedAt >= mondayStartDate && track.playedAt < tuesdayStartDate) {
              times[0]!.value += trackTime
          } else if(track.playedAt >= tuesdayStartDate && track.playedAt < wednesdayStartDate) {
              times[1]!.value += trackTime
          } else if(track.playedAt >= wednesdayStartDate && track.playedAt < thursdayStartDate) {
              times[2]!.value += trackTime
          } else if(track.playedAt >= thursdayStartDate && track.playedAt < fridayStartDate) {
              times[3]!.value += trackTime
          } else if(track.playedAt >= fridayStartDate && track.playedAt < saturdayStartDate) {
              times[4]!.value += trackTime
          } else if(track.playedAt >= saturdayStartDate && track.playedAt < sundayStartDate) {
              times[5]!.value += trackTime
          } else if(track.playedAt >= sundayStartDate) {
              times[6]!.value += trackTime
          }


          totalTime += trackTime
      }

      const timeInMins = Math.floor(totalTime / 60000)

      return {
        times: times,
        totalTime: timeInMins
      }
    }),

  topSongs: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const songsPlayed = await db.select().from(songHistory)
        .where(
            and(
                eq(songHistory.playedBy, input.userId),
                gte(songHistory.playedAt, startOfWeek(new Date(), { weekStartsOn: 1 }))
            )
        )
    
      const occurrencesMap: Record<string, number> = {};

      type SongsPlayed = typeof songsPlayed[0]
      interface TopSongs extends SongsPlayed {
          occurrences: number
      }

      songsPlayed.forEach(song => {
          if(song.spotifyId in occurrencesMap) {
              occurrencesMap[song.spotifyId]++
          } else {
              occurrencesMap[song.spotifyId] = 1
          }
      })

      const sortedIds = Object.keys(occurrencesMap).sort((a, b) => occurrencesMap[b]! - occurrencesMap[a]!);
      const topSongs: TopSongs[]  = []
      for (let i = 0; i < 10; i++) {
          const id = sortedIds[i]
          const object = songsPlayed.find(obj => obj.spotifyId == id)
          if(object) {
              topSongs.push({ occurrences: occurrencesMap[id!]!, ...object })
          }
      }

      return topSongs

    }),

  topArtists: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const songsPlayed = await db.select().from(songHistory)
        .where(
            and(
                eq(songHistory.playedBy, input.userId),
                gte(songHistory.playedAt, startOfWeek(new Date(), { weekStartsOn: 1 }))
            )
        )
      
      const occurrencesMap: Record<string, number> = {};

      type SongsPlayed = typeof songsPlayed[0]
      interface TopSongs extends SongsPlayed {
          occurrences: number
      }

      songsPlayed.forEach(song => {
          if(song.artistId in occurrencesMap) {
              occurrencesMap[song.artistId]++
          } else {
              occurrencesMap[song.artistId] = 1
          }
      })

      const sortedIds = Object.keys(occurrencesMap).sort((a, b) => occurrencesMap[b]! - occurrencesMap[a]!);
      const topSongs: TopSongs[]  = []
      for (let i = 0; i < 10; i++) {
          const id = sortedIds[i]
          const object = songsPlayed.find(obj => obj.artistId == id)
          if(object) {
              topSongs.push({ occurrences: occurrencesMap[id!]!, ...object })
          }
      }

      return topSongs
    })

  // create: publicProcedure
  //   .input(z.object({ name: z.string().min(1) }))
  //   .mutation(async ({ ctx, input }) => {
  //     // simulate a slow db call
  //     await new Promise((resolve) => setTimeout(resolve, 1000));

  //     await ctx.db.insert(posts).values({
  //       name: input.name,
  //     });
  //   }),

  // getLatest: publicProcedure.query(({ ctx }) => {
  //   return ctx.db.query.posts.findFirst({
  //     orderBy: (posts, { desc }) => [desc(posts.createdAt)],
  //   });
  // }),
});
