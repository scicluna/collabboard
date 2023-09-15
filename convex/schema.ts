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
        x: v.number(),
        y: v.number(),
        width: v.number(),
        height: v.number(),
        fontSize: v.number(),
        zIndex: v.number(),
        text: v.string(),
    }),
    lines: defineTable({
        userId: v.string(),
        boardId: v.string(),
        x: v.number(),
        y: v.number(),
        width: v.number(),
        height: v.number(),
        zIndex: v.number(),
        path: v.string(),
        strokeColor: v.string(),
    }),
    pins: defineTable({
        userId: v.string(),
        boardId: v.string(),
        x: v.number(),
        y: v.number(),
        zIndex: v.number(),
        connectedNotes: v.optional(v.array(v.id("pins")))
    })
});
