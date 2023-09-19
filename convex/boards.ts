import { query } from "./_generated/server"
import { mutation } from "./_generated/server"
import { v } from "convex/values"

export const getBoards = query({
    args: {
        userId: v.string()
    },
    handler: (ctx, args) => {
        const boards = ctx.db.query("boards").filter(q => q.eq(q.field("userId"), args.userId)).collect()
        return boards
    }
})

export const newBoard = mutation({
    args: {
        userId: v.string(),
        boardName: v.string()
    },
    handler: async (ctx, args) => {
        const newBoard = await ctx.db.insert("boards", { userId: args.userId, boardName: args.boardName })
        return newBoard
    }
})

export const deleteBoard = mutation({
    args: {
        userId: v.string(),
        boardId: v.id("boards")
    },
    handler: async (ctx, args) => {
        const boardToDelete = await ctx.db.query("boards").filter(q => q.eq(q.field("_id"), args.boardId)).collect()
        if (boardToDelete[0].userId !== args.userId) return

        const deleteBoard = await ctx.db.delete(args.boardId)
        return deleteBoard
    },
})

export const checkBoard = mutation({
    args: {
        userId: v.string(),
        boardId: v.id("boards")
    },
    handler: async (ctx, args) => {
        const checkBoard = await ctx.db.query("boards").filter(q => q.eq(q.field("_id"), args.boardId)).collect()
        if (!checkBoard[0]) {
            return false
        }
        return true
    }
})