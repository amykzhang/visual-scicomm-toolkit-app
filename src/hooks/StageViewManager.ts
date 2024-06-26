import { useState, useRef, useEffect, useCallback } from "react";
import Konva from "konva";
import { persistance } from "../utils/persistance";

const zoomScale = 1.1;
const zoomConstants = [
    10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200,
];

const stageState = persistance.retrieveStageState();

export const StageViewManager = (canvas_size: { width: number; height: number }) => {
    const [zoomLevel, setZoomLevel] = useState(() => {
        if (stageState !== null) {
            const { scaleX } = stageState;
            return Math.floor(scaleX * 100);
        } else {
            return 100;
        }
    });

    const [fullscreen, setFullscreen] = useState(document.fullscreenElement !== null);

    const stageRef = useRef<Konva.Stage>(null);

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
                const newScale = dy < 0 ? oldScale * zoomScale : oldScale / zoomScale;

                const pointer = stage.getPointerPosition();
                if (pointer !== null) handleZoom(oldScale, newScale, pointer);
            }

            // persist stage state
            persistance.persistStageState({
                stagePosition: stage.getAbsolutePosition(),
                scaleX: stage.scaleX(),
            });
        }
    }

    const zoomFit = useCallback(() => {
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

            // persist stage state
            persistance.persistStageState({
                stagePosition: stage.getAbsolutePosition(),
                scaleX: stage.scaleX(),
            });
        }
        return;
    }, [canvas_size]);

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
            document
                .exitFullscreen()
                .then(() => setFullscreen(false))
                .catch((err) => {
                    alert(`Error attempting to exit fullscreen mode: ${err.message} (${err.name})`);
                });
        } else {
            document.body
                .requestFullscreen()
                .then(() => setFullscreen(true))
                .catch((err) => {
                    alert(
                        `Error attempting to enable fullscreen mode: ${err.message} (${err.name})`
                    );
                });
        }
    }

    useEffect(() => {
        if (stageRef.current !== null) {
            const stage = stageRef.current;

            stage.width(document.body.offsetWidth);
            stage.height(document.body.offsetHeight);
            stage.batchDraw();
        }
    }, [fullscreen]);

    // Load persisted stage state on initial load
    useEffect(() => {
        if (stageState !== null) {
            const { stagePosition, scaleX } = stageState;
            if (stageRef.current !== null) {
                const stage = stageRef.current;
                stage.position(stagePosition);
                stage.scale({ x: scaleX, y: scaleX });
                stage.batchDraw();
            }
        } else {
            zoomFit();
        }
    }, [zoomFit]);

    return {
        stageRef,
        handleWheel,
        zoomLevel,
        zoomIn,
        zoomOut,
        zoomFit,
        toggleFullscreen,
    };
};
