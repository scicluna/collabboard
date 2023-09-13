import { v } from "convex/values"
import { mutation, query } from "./_generated/server"


export const getLines = query({
    args: {
        boardId: v.string()
    },
    handler: (ctx, args) => {
        const lines = ctx.db.query("lines").filter(q => q.eq(q.field("boardId"), args.boardId)).collect()
        return lines
    }
})

export const createNewLine = mutation({
    args: {
        userId: v.string(),
        boardId: v.string(),
        x: v.number(),
        y: v.number(),
        width: v.number(),
        height: v.number(),
        zIndex: v.number(),
        path: v.string(),
        strokeColor: v.string()
    },
    handler: async (ctx, args) => {
        const newNote = await ctx.db.insert("lines",
            {
                userId: args.userId,
                boardId: args.boardId,
                x: args.x,
                y: args.y,
                width: args.width,
                height: args.height,
                zIndex: args.zIndex,
                path: args.path,
                strokeColor: args.strokeColor
            })
        return newNote
    }
})

export const updateLine = mutation({
    args: {
        lineId: v.id("lines"),
        userId: v.optional(v.string()),
        boardId: v.optional(v.string()),
        x: v.optional(v.number()),
        y: v.optional(v.number()),
        width: v.optional(v.number()),
        height: v.optional(v.number()),
        zIndex: v.optional(v.number()),
        path: v.optional(v.string()),
        strokeColor: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const userId = args.userId
        const boardId = args.boardId
        const x = args.x
        const y = args.y
        const width = args.width
        const height = args.height
        const zIndex = args.zIndex
        const path = args.path
        const strokeColor = args.strokeColor

        console.log("TRYING")

        const updateLine = await ctx.db.patch(args.lineId,
            {
                userId,
                boardId,
                x,
                y,
                width,
                height,
                zIndex,
                path,
                strokeColor
            })
        return updateLine
    }

})

export const deleteNote = mutation({
    args: {
        lineId: v.id("lines")
    },
    handler: async (ctx, args) => {
        const deletedLine = await ctx.db.delete(args.lineId)
        return deletedLine
    }
})