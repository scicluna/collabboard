import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
    path: "/sendImage",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
        // Step 1: Store the file
        console.log("HTTP GO")
        const blob = await request.blob();
        const storageId = await ctx.storage.store(blob);

        // Step 2: Save the storage ID to the database via a mutation
        const userId = new URL(request.url).searchParams.get("userId");
        const boardId = new URL(request.url).searchParams.get("boardId");
        const x = parseInt(new URL(request.url).searchParams.get("x") || "0");
        const y = parseInt(new URL(request.url).searchParams.get("y") || "0");
        const width = parseInt(new URL(request.url).searchParams.get("width") || "0");
        const height = parseInt(new URL(request.url).searchParams.get("height") || "0");
        const zIndex = parseInt(new URL(request.url).searchParams.get("zIndex") || "0");
        if (userId && boardId && x && y && zIndex) {
            await ctx.runMutation(api.images.uploadImage, { userId, boardId, x, y, width, height, zIndex, storageId });
        }
        // Step 3: Return a response with the correct CORS headers
        return new Response(null, {
            status: 200,
            // CORS headers
            headers: new Headers({
                // e.g. https://mywebsite.com
                "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_CLIENT_ORIGIN!,
                "Vary": "origin",
            }),
        });
    }),
});

http.route({
    path: "/sendImage",
    method: "OPTIONS",
    handler: httpAction(async (_, request) => {
        // Make sure the necessary headers are present
        // for this to be a valid pre-flight request
        const headers = request.headers;
        console.log(headers)
        if (
            headers.get("Origin") !== null &&
            headers.get("Access-Control-Request-Method") !== null &&
            headers.get("Access-Control-Request-Headers") !== null
        ) {
            return new Response(null, {
                headers: new Headers({
                    // e.g. https://mywebsite.com
                    "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_CLIENT_ORIGIN!,
                    "Access-Control-Allow-Methods": "POST",
                    "Access-Control-Allow-Headers": "Content-Type",
                }),
            });
        } else {
            return new Response();
        }
    }),
});
export default http;