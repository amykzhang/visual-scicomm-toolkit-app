/**
 * Given a zoom level, calculates the values needed to resize the editor
 * @param zoomLevel 1 to 10
 * @param ratio width/height ratio
 * @returns [width, height]
 */
export function calculateZoom(zoomLevel: number, ratio: number = 1.0458) {
    const pixelWidth = (vw: number) =>
        Math.round((document.documentElement.clientWidth * vw) / 100);
    const pxWidth = pixelWidth(30 + 7 * zoomLevel);
    const pxHeight = Math.round(pxWidth / ratio);

    return { width: pxWidth, height: pxHeight };
}
