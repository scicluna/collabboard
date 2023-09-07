import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    boards: defineTable({
        boardName: v.string(),
        userId: v.string(),
    }),
});