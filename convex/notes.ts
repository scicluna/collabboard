import { query } from "./_generated/server";
import { mutation } from "./_generated/server"
import { v } from "convex/values"

export const createNewNote = mutation({
    args: {
        userId: v.string(),
        boardId: v.string(),
        top: v.number(),
        left: v.number(),
        width: v.number(),
        height: v.number(),
        fontSize: v.number(),
        zIndex: v.number(),
        text: v.string(),
        connectedNotes: v.array(v.string()),
    },
    handler: async (ctx, args) => {
        const newNote = await ctx.db.insert("notes",
            {
                userId: args.userId,
                boardId: args.boardId,
                top: args.top,
                left: args.left,
                width: args.width,
                height: args.height,
                fontSize: args.fontSize,
                zIndex: args.zIndex,
                text: args.text,
            })
        return newNote
    }
})