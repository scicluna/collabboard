import { query } from "./_generated/server";
import { mutation } from "./_generated/server"
import { v } from "convex/values"

export const getNotes = query({
    args: {
        boardId: v.string()
    },
    handler: (ctx, args) => {
        const notes = ctx.db.query("notes").filter(q => q.eq(q.field("boardId"), args.boardId)).collect()
        return notes
    }
})


export const createNewNote = mutation({
    args: {
        userId: v.string(),
        boardId: v.string(),
        x: v.number(),
        y: v.number(),
        width: v.number(),
        height: v.number(),
        fontSize: v.number(),
        zIndex: v.number(),
        text: v.string(),
    },
    handler: async (ctx, args) => {
        const newNote = await ctx.db.insert("notes",
            {
                userId: args.userId,
                boardId: args.boardId,
                x: args.x,
                y: args.y,
                width: args.width,
                height: args.height,
                fontSize: args.fontSize,
                zIndex: args.zIndex,
                text: args.text,
            })
        return newNote
    }
})