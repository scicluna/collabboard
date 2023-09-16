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
        connectedPins: v.optional(v.array(v.id("pins")))
    },
    handler: async (ctx, args) => {
        const newPin = await ctx.db.insert("pins",
            {
                userId: args.userId,
                boardId: args.boardId,
                x: args.x,
                y: args.y,
                zIndex: args.zIndex,
                connectedPins: args.connectedPins
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

        const connectionsOne = pinOne.connectedPins || [pinOne._id]
        const connectionsTwo = pinTwo.connectedPins || [pinTwo._id]

        const newPinConnectionOne = await ctx.db.patch(args.pinOneId, {
            userId: pinOne.userId,
            boardId: pinOne.boardId,
            x: pinOne.x,
            y: pinOne.y,
            zIndex: pinOne.zIndex,
            connectedPins: [...connectionsOne, pinTwo._id]
        })
        const newPinConnectionTwo = await ctx.db.patch(args.pinTwoId, {
            userId: pinTwo.userId,
            boardId: pinTwo.boardId,
            x: pinTwo.x,
            y: pinTwo.y,
            zIndex: pinTwo.zIndex,
            connectedPins: [...connectionsTwo, pinOne._id]
        })

        return newPinConnectionOne
    }
})

export const updatePin = mutation({
    args: {
        pinId: v.id("pins"),
        userId: v.optional(v.string()),
        boardId: v.optional(v.string()),
        x: v.optional(v.number()),
        y: v.optional(v.number()),
        zIndex: v.optional(v.number()),
        connectedPins: v.optional(v.array(v.id("pins")))
    },
    handler: async (ctx, args) => {
        const userId = args.userId
        const boardId = args.boardId
        const x = args.x
        const y = args.y
        const zIndex = args.zIndex
        const connectedPins = args.connectedPins

        console.log("TRYING")

        const updatedPin = await ctx.db.patch(args.pinId,
            {
                userId,
                boardId,
                x,
                y,
                zIndex,
                connectedPins
            })
        return updatedPin
    }
})

export const deletePin = mutation({
    args: {
        pinId: v.id("pins")
    },
    handler: async (ctx, args) => {
        console.log("delete pin")
        const deletedPin = await ctx.db.delete(args.pinId)
        return deletedPin
    }
})