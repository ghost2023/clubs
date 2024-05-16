import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure
} from "~/server/api/trpc";


export const clubRouter = createTRPCRouter({
  register: protectedProcedure.input(z.object({
    name: z.string(),
  description: z.string(),
    image: z.string()
  })).mutation(async ({ctx, input: {name, description, image}}) => {
    if(ctx.session.user.clubId) throw new TRPCError({'code': 'CONFLICT'})

    const club = await ctx.db.club.create({
      data: {
        creator_id: ctx.session.user.id,
        image,
        name,
        description
      }
    })
    return club
  })
})
