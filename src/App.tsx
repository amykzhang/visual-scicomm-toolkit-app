import { useState } from "react";
import { Stage, Layer, Circle, Image } from "react-konva";
import Konva from "konva";
import styled from "styled-components";
import { StageViewManager } from "./functions";
import { CommentViewManager } from "./functions";
import { STAGE_VIEW } from "./utils/enums";
import { ElementsPanel } from "./Panels/ElementsPanel";
import { ToolbarPanel } from "./Panels/ToolbarPanel";
import { ActivityPanel } from "./Panels/ActivityPanel";
import { ZoomPanel } from "./Panels/ZoomPanel";
import { TitlePanel } from "./Panels/TitlePanel";
import { BottomZone, TopZone } from "./styles/containers";
import typography from "./styles/typography";
import { ExportArea } from "./components/ExportArea";
import { ExitCommentViewButton } from "./components/Components";
import activity_visual_strategies from "./activity/activity";
import { CommentViewProp, ImageProp } from "./utils/interfaces";

const activity = activity_visual_strategies;

const AppContainer = styled.div``;

const PanelsContainer = styled.div`
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100vw;
    height: 100vh;
    inset: 0px;
    z-index: 300;
    pointer-events: none;
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

const initial_state = generateShapes();

export default function App() {
    // Images
    const [images, setImages] = useState<ImageProp[]>([]);
    let startX = 0;
    let startY = 0;

    const handleDragStart = (
        elements: any[],
        setElements: React.Dispatch<React.SetStateAction<any>>
    ) => {
        return (e: Konva.KonvaEventObject<DragEvent>) => {
            console.log(e.target.x(), e.target.y());
            console.log("start");

            const id = e.target.id();

            startX = e.target.x();
            startY = e.target.y();

            setElements(
                elements.map((element) => {
                    return {
                        ...element,
                        isDragging: element.id === id,
                    };
                })
            );
        };
    };

    const handleDragEnd = (
        elements: any[],
        setElements: React.Dispatch<React.SetStateAction<any>>
    ) => {
        return (e: Konva.KonvaEventObject<DragEvent>) => {
            console.log("end");
            console.log(e.target.x(), e.target.y());

            const id = e.target.id();

            const endX = e.target.x();
            const endY = e.target.y();
            const diffX = endX - startX;
            const diffY = endY - startY;

            setElements(
                elements
                    .filter((element) => element.isDragging)
                    .map((element) => {
                        console.log(element);
                        return {
                            ...element,
                            x: element.x - diffX,
                            y: element.y - diffY,
                            isDragging: false,
                        };
                    })
            );

            console.log(elements.find((el) => el.id === id));
        };
    };

    // Stage View
    const {
        view,
        setView,
        stageRef,
        zoomStage,
        handleTouchMove,
        handleTouchEnd,
        handleWheel,
    } = StageViewManager();

    // Comment View
    const commentView = CommentViewManager(setView);

    const canvasElementConstants = {
        perfectDrawEnabled: false,
        draggable: view === STAGE_VIEW.select,
    };

    function printPosition(e: Konva.KonvaEventObject<MouseEvent>) {
        console.log("mouse pos: ", e.evt.clientX, e.evt.clientY);
        console.log("konva pos: ", e.target.x(), e.target.y());
        console.log("zoom:, ", stageRef.current?.scale());
    }

    return (
        <AppContainer>
            <PanelsContainer>
                <TopZone>
                    <TitlePanel {...activity} />
                    <ToolbarPanel
                        view={view}
                        setView={setView}
                        commentView={commentView}
                    />
                    <ExitCommentView commentView={commentView} />
                </TopZone>
                <ActivityPanel activity={activity} />
                <ElementsPanel
                    activity={activity}
                    images={images}
                    setImages={setImages}
                    stageRef={stageRef}
                />
                <BottomZone>
                    <ZoomPanel />
                </BottomZone>
            </PanelsContainer>
            <Stage
                width={window.innerWidth}
                height={window.innerHeight}
                // draggable={isPanning}
                draggable={true}
                onWheel={handleWheel}
                // onTouchMove={handleTouchMove}
                // onTouchEnd={handleTouchEnd}
                ref={stageRef}
                fill={commentView.state.backgroundColor}
                onClick={printPosition}
            >
                <Layer>
                    <ExportArea {...activity.canvas_size} />
                    {/* {shapes.map((shape) => (
                        <Circle
                            key={shape.id}
                            id={shape.id}
                            x={shape.x}
                            y={shape.y}
                            radius={25}
                            fill="#050505"
                            opacity={0.8}
                            draggable={view === STAGE_VIEW.select}
                            scaleX={shape.isDragging ? 1.05 : 1}
                            scaleY={shape.isDragging ? 1.05 : 1}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                            {...canvasElementConstants}
                        />
                    ))} */}
                    {images.map((image) => {
                        return (
                            <Image
                                key={image.id}
                                id={image.id}
                                x={image.x}
                                y={image.y}
                                image={image.image}
                                onDragStart={handleDragStart(images, setImages)}
                                onDragEnd={handleDragEnd(images, setImages)}
                                {...canvasElementConstants}
                            />
                        );
                    })}
                </Layer>
            </Stage>
        </AppContainer>
    );
}

interface ExitCommentStateProps {
    commentView: CommentViewProp;
}

const ExitCommentView: React.FC<ExitCommentStateProps> = ({ commentView }) => {
    const displayStyle = commentView.state.active ? {} : { display: "none" };

    return (
        <ExitCommentViewButton style={displayStyle} onClick={commentView.exit}>
            <typography.LargeText>Exit Comment Mode</typography.LargeText>
        </ExitCommentViewButton>
    );
};
