import { useState, useRef, useEffect } from "react";
import Konva from "konva";
import { STAGE_VIEW } from "../utils/enums";

export const StageViewManager = () => {
    const [view, setView] = useState(STAGE_VIEW.select);

    // Keyboard shortcuts
    let shiftPressed = false;
    let ctrlPressed = false;
    let altPressed = false;
    let metaPressed = false;

    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === "Shift") shiftPressed = true;
        if (e.key === "Control") ctrlPressed = true;
        if (e.key === "Alt") altPressed = true;
        if (e.key === "Meta") metaPressed = true;
        console.log(shiftPressed, ctrlPressed, altPressed, metaPressed);
    }

    function handleKeyUp(e: KeyboardEvent) {
        if (e.key === "Shift") shiftPressed = false;
        if (e.key === "Control") ctrlPressed = false;
        if (e.key === "Alt") altPressed = false;
        if (e.key === "Meta") metaPressed = false;
        console.log(shiftPressed, ctrlPressed, altPressed, metaPressed);
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Zooming
    const stageRef = useRef<Konva.Stage | null>(null);
    let lastCenter: { x: number; y: number } | null;
    let lastDist = 0;
    const zoomScale = 1.02;
    const zoomConstants = [
        2, 3, 6, 13, 25, 50, 100, 200, 300, 400, 800, 1600, 3200, 6400, 12800,
        25600,
    ];
    let zoomIndex = 6;

    function zoomStage(event: Konva.KonvaEventObject<WheelEvent>) {
        console.log("wheel");

        event.evt.preventDefault();

        if (stageRef.current !== null) {
            const stage = stageRef.current;
            const oldScale = stage.scaleX();
            const pointer = stage.getPointerPosition();
            const pointerX = pointer?.x as number;
            const pointerY = pointer?.y as number;
            const mousePointTo = {
                x: (pointerX - stage.x()) / oldScale,
                y: (pointerY - stage.y()) / oldScale,
            };
            const newScale =
                event.evt.deltaY > 0
                    ? oldScale * zoomScale
                    : oldScale / zoomScale;
            stage.scale({ x: newScale, y: newScale });

            const newPos = {
                x: pointerX - mousePointTo.x * newScale,
                y: pointerY - mousePointTo.y * newScale,
            };

            stage.position(newPos);
            stage.batchDraw();
        }
    }

    function zoom() {}

    function zoomIn() {}

    function zoomOut() {}

    function handleTouchMove(e: Konva.KonvaEventObject<TouchEvent>) {
        console.log("touchmove");
        e.evt.preventDefault();

        var touch1 = e.evt.touches[0];
        var touch2 = e.evt.touches[1];

        if (stageRef.current !== null) {
            const stage = stageRef.current;

            if (touch1 && touch2) {
                if (stage.isDragging()) {
                    stage.stopDrag();
                }

                var p1 = {
                    x: touch1.clientX,
                    y: touch1.clientY,
                };
                var p2 = {
                    x: touch2.clientX,
                    y: touch2.clientY,
                };

                if (!lastCenter) {
                    lastCenter = getCenter(p1, p2);
                    return;
                }
                var newCenter = getCenter(p1, p2);

                var dist = getDistance(p1, p2);

                if (!lastDist) {
                    lastDist = dist;
                }

                // local coordinates of center point
                var pointTo = {
                    x: (newCenter.x - stage.x()) / stage.scaleX(),
                    y: (newCenter.y - stage.y()) / stage.scaleX(),
                };

                var scale = stage.scaleX() * (dist / lastDist);

                stage.scaleX(scale);
                stage.scaleY(scale);

                // calculate new position of the stage
                var dx = newCenter.x - lastCenter.x;
                var dy = newCenter.y - lastCenter.y;

                var newPos = {
                    x: newCenter.x - pointTo.x * scale + dx,
                    y: newCenter.y - pointTo.y * scale + dy,
                };

                stage.position(newPos);
                stage.batchDraw();

                lastDist = dist;
                lastCenter = newCenter;
            }
        }
    }

    function handleTouchEnd() {
        console.log("touchend");
        lastCenter = null;
        lastDist = 0;
    }

    function handleWheel(e: Konva.KonvaEventObject<WheelEvent>) {
        e.evt.preventDefault();
        if (stageRef.current !== null) {
            const stage = stageRef.current;

            const dx = e.evt.deltaX;
            const dy = e.evt.deltaY;

            // panning has integers in dx and dy, zooming has float in dy
            if (Number.isInteger(dy)) {
                console.log("pan");

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
                console.log("zoom:", dy);

                const oldScale = stage.scaleX();

                // get point to zoom in on
                const pointer = stage.getPointerPosition();
                const pointerX = pointer?.x as number;
                const pointerY = pointer?.y as number;
                const mousePointTo = {
                    x: (pointerX - stage.x()) / oldScale,
                    y: (pointerY - stage.y()) / oldScale,
                };

                const newScale =
                    dy < 0 ? oldScale * zoomScale : oldScale / zoomScale;
                const newPos = {
                    x: pointerX - mousePointTo.x * newScale,
                    y: pointerY - mousePointTo.y * newScale,
                };

                stage.scale({ x: newScale, y: newScale });
                stage.position(newPos);
                stage.batchDraw();
            }
        }
    }

    // TODO: center stage or last known positon, zoom,
    useEffect(() => {
        console.log("useEffect stageViewManager");
    }, []);

    return {
        view,
        setView,
        stageRef,
        zoomStage,
        handleTouchMove,
        handleTouchEnd,
        handleWheel,
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
