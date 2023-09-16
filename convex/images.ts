import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getImages = query({
    args: {
        boardId: v.string()
    },
    handler: async (ctx, args) => {
        const images = await ctx.db.query("images").filter(q => q.eq(q.field("boardId"), args.boardId)).collect();
        return Promise.all(
            images.map(async (image) => ({
                ...image,
                url: await ctx.storage.getUrl(image.storageId)
            }))
        );
    },
});

export const uploadImage = mutation({
    args: {
        userId: v.string(),
        boardId: v.string(),
        x: v.number(),
        y: v.number(),
        width: v.number(),
        height: v.number(),
        zIndex: v.number(),
        storageId: v.string()
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("images", {
            userId: args.userId,
            boardId: args.boardId,
            x: args.x,
            y: args.y,
            width: args.width,
            height: args.height,
            zIndex: args.zIndex,
            storageId: args.storageId
        });
    },
});

export const deleteImage = mutation({
    args: {
        imageId: v.id("images")
    },
    handler: async (ctx, args) => {
        const deletedImage = await ctx.db.delete(args.imageId)
        return deletedImage
    }
})

export const updateImage = mutation({
    args: {
        imageId: v.id("images"),
        userId: v.string(),
        boardId: v.string(),
        x: v.number(),
        y: v.number(),
        width: v.number(),
        height: v.number(),
        zIndex: v.number(),
        storageId: v.string()
    },
    handler: async (ctx, args) => {
        const updateLine = await ctx.db.patch(args.imageId,
            {
                userId: args.userId,
                boardId: args.boardId,
                x: args.x,
                y: args.y,
                width: args.width,
                height: args.height,
                zIndex: args.zIndex,
                storageId: args.storageId,
            })
        return updateLine
    }

})