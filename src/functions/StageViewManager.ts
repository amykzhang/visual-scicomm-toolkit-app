import { useState, useRef, useEffect } from "react";
import Konva from "konva";
import { APP_VIEW } from "../utils/enums";

const zoomScale = 1.1;
const zoomConstants = [
    2, 3, 6, 13, 25, 50, 100, 200, 300, 400, 800, 1600, 3200, 6400, 12800,
    25600,
];

export const StageViewManager = (canvas_size: {
    width: number;
    height: number;
}) => {
    const [view, setView] = useState(APP_VIEW.select);
    const [zoomLevel, setZoomLevel] = useState(100);

    // Keyboard shortcuts
    let canZoom = true;
    let metaPressed = false;

    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === "Meta") metaPressed = true;

        // Zoom shortcuts (shift/meta +, shift/meta -, shift/meta 0)
        // if (canZoom) {
        //     if (e.key === "+" || (metaPressed && e.key === "=")) {
        //         e.preventDefault();
        //         zoomIn();
        //     }
        //     if (e.key === "_" || (metaPressed && e.key === "-")) {
        //         e.preventDefault();
        //         zoomOut();
        //     }
        //     if (e.key === ")" || (metaPressed && e.key === "0")) {
        //         e.preventDefault();
        //         zoomFit();
        //     }
        // }
    }

    function handleKeyUp(e: KeyboardEvent) {
        metaPressed = false;
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    // Zooming
    const stageRef = useRef<Konva.Stage | null>(null);

    function handleZoom(
        oldScale: number,
        newScale: number,
        focal: { x: number; y: number } // of viewport, outside of stage coords
    ) {
        if (stageRef.current !== null) {
            const stage = stageRef.current;

            // mouse point is vector to where to center on
            const focalPointTo = {
                x: (focal.x - stage.x()) / oldScale,
                y: (focal.y - stage.y()) / oldScale,
            };
            // calculate where new view is by subtracting vector from center back to top left with new scale applied
            const newTopLeft = {
                x: focal.x - focalPointTo.x * newScale,
                y: focal.y - focalPointTo.y * newScale,
            };

            stage.scale({ x: newScale, y: newScale });
            stage.position(newTopLeft);
            stage.batchDraw();
            setZoomLevel(Math.floor(newScale * 100));
        }
    }

    function handleWheel(e: Konva.KonvaEventObject<WheelEvent>) {
        e.evt.preventDefault();
        if (stageRef.current !== null) {
            const stage = stageRef.current;

            const dx = e.evt.deltaX;
            const dy = e.evt.deltaY;

            // panning has integers in dx and dy, zooming has float in dy
            if (Number.isInteger(dy)) {
                if (stage.isDragging()) {
                    stage.stopDrag();
                }

                var newPos = {
                    x: stage.x() - dx,
                    y: stage.y() - dy,
                };

                stage.position(newPos);
                stage.batchDraw();
            } else {
                const oldScale = stage.scaleX();
                const newScale =
                    dy < 0 ? oldScale * zoomScale : oldScale / zoomScale;

                const pointer = stage.getPointerPosition();
                if (pointer !== null) handleZoom(oldScale, newScale, pointer);
            }
        }
    }

    function zoomFit() {
        if (stageRef.current !== null) {
            const stage = stageRef.current;

            // 100% zoom
            const defaultScale = { x: 1, y: 1 };

            // center stage
            const { width, height } = canvas_size;
            const offsetX = -(window.innerWidth - width) / 2;
            const offsetY = -(window.innerHeight - height) / 2;
            const centerPos = { x: -offsetX, y: -offsetY };

            stage.scale(defaultScale);
            stage.position(centerPos);
            stage.batchDraw();
            setZoomLevel(100);
        }
        return;
    }

    function zoomIn() {
        if (stageRef.current !== null) {
            const stage = stageRef.current;

            // curr/next Zoom in %, old/new Scale in decimal
            const oldScale = stage.scaleX();
            // get next zoom degree
            const currentZoom = Math.floor(oldScale * 100);
            const nextZoom = zoomConstants.reduceRight((prev, curr) => {
                return curr > currentZoom ? curr : prev;
            });

            const newScale = nextZoom / 100;

            const center = {
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
            };

            handleZoom(oldScale, newScale, center);
        }
    }

    function zoomOut() {
        if (stageRef.current !== null) {
            const stage = stageRef.current;

            // similar to zoomIn() but reduce left
            const oldScale = stage.scaleX();
            const currentZoom = Math.floor(oldScale * 100);
            const nextZoom = zoomConstants.reduce((prev, curr) => {
                return curr < currentZoom ? curr : prev;
            });
            const newScale = nextZoom / 100;

            const center = {
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
            };

            handleZoom(oldScale, newScale, center);
        }
    }

    function toggleFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen().catch((err) => {
                alert(
                    `Error attempting to enable fullscreen mode: ${err.message} (${err.name})`
                );
            });
        } else {
            document.body.requestFullscreen();
        }
    }

    return {
        view,
        setView,
        stageRef,
        handleWheel,
        zoomLevel,
        zoomIn,
        zoomOut,
        zoomFit,
        toggleFullscreen,
    };
};

// Zooming
function getDistance(
    p1: { x: number; y: number },
    p2: { x: number; y: number }
) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

function getCenter(p1: { x: number; y: number }, p2: { x: number; y: number }) {
    return {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2,
    };
}

function isTouchEnabled() {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}
