import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    boards: defineTable({
        boardName: v.string(),
        userId: v.string(),
    }),
    notes: defineTable({
        userId: v.string(),
        boardId: v.string(),
        top: v.number(),
        left: v.number(),
        width: v.number(),
        height: v.number(),
        fontSize: v.number(),
        zIndex: v.number(),
        text: v.string(),
        connectedNotes: v.optional(v.array(v.string()))
    })
});
