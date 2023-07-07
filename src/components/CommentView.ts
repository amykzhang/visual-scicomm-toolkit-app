function enterCommentView() {
    const canvas: HTMLDivElement = document.querySelector(".rs-canvas")!;
    canvas.style.backgroundColor = "#D9D9D9";
}

function exitCommentView() {
    const canvas: HTMLDivElement = document.querySelector(".rs-canvas")!;
    canvas.style.backgroundColor = "var(--color-background)";
}

export default { enterCommentView, exitCommentView };
