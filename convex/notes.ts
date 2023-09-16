import { query } from "./_generated/server";
import { mutation } from "./_generated/server"
import { v } from "convex/values"

export const getNotes = query({
    args: {
        boardId: v.string()
    },
    handler: async (ctx, args) => {
        const notes = await ctx.db.query("notes").filter(q => q.eq(q.field("boardId"), args.boardId)).collect()
        return notes
    }
})

export const deleteNote = mutation({
    args: {
        noteId: v.id("notes")
    },
    handler: async (ctx, args) => {
        const deletedNote = await ctx.db.delete(args.noteId)
        return deletedNote
    }
})

export const updateNote = mutation({
    args: {
        noteId: v.id("notes"),
        userId: v.optional(v.string()),
        boardId: v.optional(v.string()),
        x: v.optional(v.number()),
        y: v.optional(v.number()),
        width: v.optional(v.number()),
        height: v.optional(v.number()),
        fontSize: v.optional(v.number()),
        zIndex: v.optional(v.number()),
        text: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = args.userId
        const boardId = args.boardId
        const x = args.x
        const y = args.y
        const width = args.width
        const height = args.height
        const fontSize = args.fontSize
        const zIndex = args.zIndex
        const text = args.text

        if (!await ctx.db.get(args.noteId)) {
            return null
        }

        const updatedNote = await ctx.db.patch(args.noteId,
            {
                userId,
                boardId,
                x,
                y,
                width,
                height,
                fontSize,
                zIndex,
                text,
            })
        return updatedNote
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