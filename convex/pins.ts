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