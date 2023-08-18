import { useEffect, useState } from "react";
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
const localKey = "konva-canvas";

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

function saveCanvasState(elements: any[]) {
    localStorage.setItem(localKey, JSON.stringify(elements));
}

function getCanvasState() {
    return localStorage.getItem(localKey);
}

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
            console.log("DragStart");
            console.log(e.target.x(), e.target.y());

            const id = e.target.id();

            startX = e.target.x();
            startY = e.target.y();

            const newElements = elements.map((element) => {
                return { ...element, isDragging: element.id === id };
            });

            setElements(newElements);
        };
    };

    const handleDragEnd = (
        elements: any[],
        setElements: React.Dispatch<React.SetStateAction<any>>
    ) => {
        return (e: Konva.KonvaEventObject<DragEvent>) => {
            console.log("DragEnd");
            console.log(e.target.x(), e.target.y());
            console.log(e.target.getAbsolutePosition());
            const id = e.target.id();

            const endX = e.target.x();
            const endY = e.target.y();

            const newElements = elements.map((element) => {
                console.log("filtered", element);
                if (element.isDragging) {
                    return {
                        ...element,
                        x: endX,
                        y: endY,
                        isDragging: false,
                    };
                } else {
                    return element;
                }
            });

            setElements(newElements);
            // saveCanvasState(newElements);
        };
    };

    // Stage View
    const {
        view,
        setView,
        stageRef,
        handleWheel,
        zoomLevel,
        zoomIn,
        zoomOut,
        zoomFit,
        toggleFullscreen,
    } = StageViewManager(activity.canvas_size);

    // Comment View
    const commentView = CommentViewManager(setView);

    const canvasElementConstants = {
        perfectDrawEnabled: false,
        draggable: view === STAGE_VIEW.select,
    };

    function printPosition(e: Konva.KonvaEventObject<MouseEvent>) {
        if (stageRef.current !== null) {
            const stage = stageRef.current;

            //     console.log("Stage Coord: ", stage.x(), stage.y());

            const pointer = stage.getPointerPosition();
            console.log(
                "Pointer Coord: ",
                pointer?.x as number,
                pointer?.y as number
            );

            //     console.log(
            //         "Pointer relative to stage:",
            //         -stage.x() + (pointer?.x as number),
            //         -stage.y() + (pointer?.y as number)
            //     );

            //     console.log("Zoom: ", stageRef.current?.scale());

            //     console.log(
            //         "Window Dimensions: ",
            //         window.innerWidth,
            //         window.innerHeight
            //     );
        }
        console.log(images);
    }

    // Load Images from Local Storage
    useEffect(() => {
        const canvasState = getCanvasState();
        if (canvasState !== null) {
            setImages(JSON.parse(canvasState));
        }
    }, []);

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
                    <ZoomPanel
                        zoomLevel={zoomLevel}
                        zoomIn={zoomIn}
                        zoomOut={zoomOut}
                        zoomFit={zoomFit}
                        toggleFullscreen={toggleFullscreen}
                    />
                </BottomZone>
            </PanelsContainer>
            <Stage
                width={window.innerWidth}
                height={window.innerHeight}
                draggable={true}
                onWheel={handleWheel}
                ref={stageRef}
                fill={commentView.state.backgroundColor}
                onClick={printPosition}
            >
                <Layer id="export-layer">
                    <ExportArea {...activity.canvas_size} />
                </Layer>
                <Layer id="image-layer">
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
                {/* <Layer id="elements-layer"></Layer>
                <Layer id="comment-layer"></Layer> */}
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
