//welcome to the hack zone
export const adjustFontSize = (textareaElement: HTMLTextAreaElement, content: string) => {
    const tempDiv = document.createElement("div");
    tempDiv.style.width = `${textareaElement.offsetWidth}px`;
    tempDiv.style.visibility = 'hidden';
    tempDiv.style.position = 'absolute';
    tempDiv.style.whiteSpace = 'normal';  // Allow natural wrapping of content
    tempDiv.style.wordWrap = 'break-word'; // Allow long words to wrap
    document.body.appendChild(tempDiv);

    let currentFontSize = parseInt(window.getComputedStyle(textareaElement).fontSize, 10);
    tempDiv.style.fontSize = `${currentFontSize}px`;

    const MAX_ITERATIONS = 100;
    let iterations = 0;
    while (iterations < MAX_ITERATIONS) {
        tempDiv.textContent = content;
        const contentHeight = tempDiv.offsetHeight;

        //dont scale out of control at 0 content
        if (contentHeight === 0) {
            break;
        }

        if (contentHeight < textareaElement.offsetHeight - 2) {
            currentFontSize++;
        } else if (contentHeight > textareaElement.offsetHeight + 2) {
            currentFontSize--;
        } else {
            break;
        }

        tempDiv.style.fontSize = `${currentFontSize}px`;
        iterations++;
    }

    document.body.removeChild(tempDiv);
    return currentFontSize;
};
