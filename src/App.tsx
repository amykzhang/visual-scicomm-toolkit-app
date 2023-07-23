import { Stage, Layer, Circle, Rect, useStrictMode } from "react-konva";
import Konva from "konva";
import Node = Konva.Node;
import { useRef, useState } from "react";
import styled from "styled-components";

import { ElementsBar } from "./containers/ElementsBar";
import { UILayer } from "./components/Components";
import { ToolBar } from "./containers/ToolBar";
import { ActivityBar } from "./containers/ActivityBar";
import { ZoomBar } from "./containers/ZoomBar";
import { LogoBar } from "./containers/LogoBar";
import { BottomZone, TopZone } from "./styles/containers";
import { ExportArea } from "./components/ExportArea";

import activity_visual_strategies from "./activity/activity";
const activity = activity_visual_strategies;

const AppContainer = styled.div``;

const _props = { perfectDrawEnabled: false };

function generateShapes() {
    return [...Array(10)].map((_, i) => ({
        id: i.toString(),
        x: (0.2 + Math.random() * 0.6) * window.innerWidth,
        y: (0.2 + Math.random() * 0.6) * window.innerHeight,
        rotation: 0,
        isDragging: false,
    }));
}

const INITIAL_STATE = generateShapes();

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
    return (
        "ontouchstart" in window || navigator.maxTouchPoints > 0 //||
        // navigator.msMaxTouchPoints > 0
    );
}

export default function App() {
    // for example
    const [shapes, setShapes] = useState(INITIAL_STATE);

    const handleDragStart = (e: any) => {
        const id = e.target?.id();
        setShapes(
            shapes.map((shape) => {
                return {
                    ...shape,
                    isDragging: shape.id === id,
                };
            })
        );
    };

    const handleDragEnd = (e: any) => {
        setShapes(
            shapes.map((shape) => {
                return {
                    ...shape,
                    isDragging: false,
                };
            })
        );
    };

    // Panning
    const [isPanning, setIsPanning] = useState(false);
    const pan = { isPanning, setIsPanning };

    // Zooming
    type StageState = Konva.Stage | null;
    const stageRef = useRef<StageState>(null);
    let lastCenter: { x: number; y: number } | null;
    let lastDist = 0;
    const scaleBy = 1.1;

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
                event.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
            stage.scale({ x: newScale, y: newScale });
            const newPos = {
                x: pointerX - mousePointTo.x * newScale,
                y: pointerY - mousePointTo.y * newScale,
            };
            stage.position(newPos);
            stage.batchDraw();
        }
    }

    function handleTouch(e: Konva.KonvaEventObject<TouchEvent>) {
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

    return (
        <AppContainer>
            <UILayer>
                <TopZone>
                    <LogoBar {...activity} />
                    <ToolBar {...pan} />
                </TopZone>
                <ActivityBar activity={activity} />
                <ElementsBar activity={activity} />
                <BottomZone>
                    <ZoomBar />
                </BottomZone>
            </UILayer>
            <Stage
                width={window.innerWidth}
                height={window.innerHeight}
                // draggable={isPanning}
                draggable={!isTouchEnabled() || isPanning}
                onWheel={zoomStage}
                onTouchMove={handleTouch}
                onTouchEnd={handleTouchEnd}
                ref={stageRef}
            >
                <Layer>
                    <ExportArea {...activity.canvas_size} />
                    {shapes.map((shape) => (
                        <Circle
                            key={shape.id}
                            id={shape.id}
                            x={shape.x}
                            y={shape.y}
                            radius={25}
                            fill="#050505"
                            opacity={0.8}
                            draggable={!isPanning}
                            scaleX={shape.isDragging ? 1.05 : 1}
                            scaleY={shape.isDragging ? 1.05 : 1}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                            {..._props}
                        />
                    ))}
                </Layer>
            </Stage>
        </AppContainer>
    );
}
