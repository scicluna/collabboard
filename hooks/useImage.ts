"use client"

type useImageProps = {
    userId: string
    boardId: string
}

export function useImage({ userId, boardId }: useImageProps) {

    const handleImageDrop = async (e: React.DragEvent) => {
        e.preventDefault();

        const files = e.dataTransfer.files;
        if (files.length === 0) {
            return;
        }

        const { clientX, clientY } = e;

        const file = files[0];
        if (file.type.startsWith("image/")) {
            // Upload the image to your server or an external service
            const sendImageUrl = new URL(`${process.env.NEXT_PUBLIC_CONVEX_SITE_URL}/sendImage`);
            sendImageUrl.searchParams.set("userId", userId);
            sendImageUrl.searchParams.set("boardId", boardId);
            sendImageUrl.searchParams.set("x", `${clientX}`);
            sendImageUrl.searchParams.set("y", `${clientY}`);
            sendImageUrl.searchParams.set("width", `${100}`);
            sendImageUrl.searchParams.set("height", `${100}`);
            sendImageUrl.searchParams.set("zIndex", "1");
            if (sendImageUrl) {
                await fetch(sendImageUrl, {
                    method: "POST",
                    headers: { "Content-Type": file.type },
                    body: file,
                });
            }
        } else {
            alert("Please upload a valid image format.");
        }
    };

    return {
        handleImageDrop
    }
}