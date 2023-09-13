export const adjustFontSize = (textareaElement: HTMLTextAreaElement, content: string) => {
    // Create a hidden div with the same width as the textarea
    const tempDiv = document.createElement("div");
    tempDiv.style.width = `${textareaElement.offsetWidth}px`;
    tempDiv.style.visibility = 'hidden';
    tempDiv.style.position = 'absolute';
    tempDiv.style.whiteSpace = 'pre-wrap';
    document.body.appendChild(tempDiv);

    let currentFontSize = parseInt(window.getComputedStyle(textareaElement).fontSize, 10);
    tempDiv.style.fontSize = `${currentFontSize}px`;


    const MAX_ITERATIONS = 100; // Prevent infinite loops
    let iterations = 0;
    // Iterate to adjust font size
    while (iterations < MAX_ITERATIONS) {
        tempDiv.textContent = content;
        const contentHeight = tempDiv.offsetHeight;

        if (contentHeight < textareaElement.offsetHeight - 2) { // If the content is too small for the container
            currentFontSize++;
        } else if (contentHeight > textareaElement.offsetHeight + 2) { // If the content overflows the container
            currentFontSize--;
        } else {
            break;
        }

        tempDiv.style.fontSize = `${currentFontSize}px`;
        iterations++;
    }

    // Remove the div from the document
    document.body.removeChild(tempDiv);

    // Apply the adjusted font size to the textarea
    textareaElement.style.fontSize = `${currentFontSize}px`;
    return currentFontSize;
};