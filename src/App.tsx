import { Stage, Layer, Circle, Rect, useStrictMode } from "react-konva";
import styled from "styled-components";
import { useState } from "react";
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

const AppContainer = styled.div`
    /* position: fixed;
    inset: 0px;
    overflow: hidden;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    touch-action: none; */
    /* width: 100vw;
    height: 100vh;
    touch-action: none;
    background-color: #ed7272; */
`;

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

export default function App() {
    // for example
    const [shapes, setShapes] = useState(INITIAL_STATE);

    // Panning
    const [isPanning, setIsPanning] = useState(false);
    const pan = { isPanning, setIsPanning };

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
                draggable={isPanning}
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
                        />
                    ))}
                    {shapes.map((shape) => (
                        <Rect
                            key={shape.id}
                            id={shape.id}
                            x={shape.x}
                            y={shape.y}
                            width={50}
                            height={50}
                            fill="#050505"
                            opacity={0.8}
                            draggable={!isPanning}
                            scaleX={shape.isDragging ? 1.05 : 1}
                            scaleY={shape.isDragging ? 1.05 : 1}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                        />
                    ))}
                </Layer>
            </Stage>
        </AppContainer>
    );
}
