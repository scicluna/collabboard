import { query } from "./_generated/server";
import { mutation } from "./_generated/server"
import { v } from "convex/values"

export const getPins = query({
    args: {
        boardId: v.string()
    },
    handler: (ctx, args) => {
        const pins = ctx.db.query("pins").filter(q => q.eq(q.field("boardId"), args.boardId)).collect()
        return pins
    }
})

export const createNewPin = mutation({
    args: {
        userId: v.string(),
        boardId: v.string(),
        x: v.number(),
        y: v.number(),
        zIndex: v.number(),
        connectedNotes: v.optional(v.array(v.id("pins")))
    },
    handler: async (ctx, args) => {
        const newPin = await ctx.db.insert("pins",
            {
                userId: args.userId,
                boardId: args.boardId,
                x: args.x,
                y: args.y,
                zIndex: args.zIndex,
                connectedNotes: args.connectedNotes
            })
        return newPin
    }
})

export const linkTwoPins = mutation({
    args: {
        pinOneId: v.id("pins"),
        pinTwoId: v.id("pins"),
    },
    handler: async (ctx, args) => {
        console.log("CONNECTING")
        const pinOne = await ctx.db.get(args.pinOneId)
        const pinTwo = await ctx.db.get(args.pinTwoId)

        if (!pinOne || !pinTwo) return

        const connectionsOne = pinOne.connectedNotes || [pinOne._id]
        const connectionsTwo = pinTwo.connectedNotes || [pinTwo._id]

        const newPinConnectionOne = await ctx.db.patch(args.pinOneId, {
            userId: pinOne.userId,
            boardId: pinOne.boardId,
            x: pinOne.x,
            y: pinOne.y,
            zIndex: pinOne.zIndex,
            connectedNotes: [...connectionsOne, pinTwo._id]
        })
        const newPinConnectionTwo = await ctx.db.patch(args.pinTwoId, {
            userId: pinTwo.userId,
            boardId: pinTwo.boardId,
            x: pinTwo.x,
            y: pinTwo.y,
            zIndex: pinTwo.zIndex,
            connectedNotes: [...connectionsTwo, pinOne._id]
        })

        return newPinConnectionOne
    }
})