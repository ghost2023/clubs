import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { env } from "~/env";

import {
    clubOwnerProcedure,
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
  }),
  
 createFund: clubOwnerProcedure.input(z.object({
    title: z.string(),
    description: z.string(),
    image: z.string(),
    goal: z.number()
  })).mutation(async ({ctx, input: {title , description, image, goal}}) => {

    const club = await ctx.db.fundRaise.create({
      data: {
        club_id: ctx.session.user.clubId!,
        images: image,
        goal,
        title,
        description
      }
    })
    return club
  }),

 createPost: clubOwnerProcedure.input(z.object({
    title: z.string(),
    description: z.string(),
    image: z.string(),
  })).mutation(async ({ctx, input: {title , description, image, }}) => {
    const club = await ctx.db.post.create({
      data: {
        club_id: ctx.session.user.clubId!,
        images: [image],
        title,
        Caption: description
      }
    })
    return club
  }),

  donate: protectedProcedure.input(z.object({cid: z.number(), id: z.number(), amount: z.number()})).mutation(async ({input, ctx}) => {
    const name = ctx.session.user.name?.split(' ') ?? ''
  
    const donation = await ctx.db.donation.create({
      data: {
        amount: input.amount,
        fund_raise_id: input.id,
        club_id: input.cid,
        user_id: ctx.session.user.id
      }
    })

var myHeaders = new Headers();
myHeaders.append("Authorization", `Bearer ${env.CHAPA_SECRET}`);
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "amount":input.amount,
  "currency": "ETB",
  "first_name": name[0],
  "last_name": name[1],
      tx_ref: donation.id.toString(),
      email: ctx.session.user.email,
      // phone_number: '0943290482',
  "callback_url": "https://www.google.com/api/chapa-webhook",
  "return_url": "https://hackathon-clubs.vercel.app/",
});

    console.log({raw});
    


const res  =await fetch("https://api.chapa.co/v1/transaction/initialize", {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
})
      const result = await res.json()
    console.log(result)

    return result.data.checkout_url as string

  }),

 createEvent: clubOwnerProcedure.input(z.object({
    title: z.string(),
    description: z.string(),
    image: z.string(),
    start_at: z.date(),
    end_at: z.date(),
    location: z.string()
  })).mutation(async ({ctx, input: {title , description, image, end_at, start_at, location }}) => {
    const club = await ctx.db.event.create({
      data: {
        club_id: ctx.session.user.clubId!,
        images: [image],
        title,
        description,
        start_at,
        end_at,
        location
      }
    })
    return club
  })
})
