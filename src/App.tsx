import { useEffect, useState } from "react";
import { Stage, Layer, Image, StageProps } from "react-konva";
import Konva from "konva";
import styled from "styled-components";
import { StageViewManager } from "./functions";
import { CommentViewManager } from "./functions";
import { APP_VIEW } from "./utils/enums";
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
import { CommentViewProp, ImageProp, UiStateProp } from "./utils/interfaces";
import persistance from "./functions/persistance";

// TODO: make this easier to customize, more modular for creators?
const activity = activity_visual_strategies;

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

export default function App() {
    // App State (stage position, zoom, view, panels)
    const [uiState, setUiState] = useState<UiStateProp>(() => {
        const saved = persistance.retrieveUiState();

        if (saved !== undefined) {
            return saved;
        } else
            return {
                isLeftPanelOpen: true,
                isRightPanelOpen: true,
                view: APP_VIEW.select,
            };
    });

    const view = uiState.view;
    const setView = (view: APP_VIEW) => {
        setUiState({ ...uiState, view: view });
    };

    // Canvas State (images)
    const [images, setImages] = useState<ImageProp[]>(() => {
        const saved = persistance.retrieveCanvasState();

        if (saved !== undefined) {
            return saved.images;
        } else return [];
    });

    // Stage View
    const {
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

    // Sets whether or not stage is draggable/pannable
    const stageConstants = {
        draggable: view === APP_VIEW.pan,
    };

    const handleDragStart = (
        elements: any[],
        setElements: React.Dispatch<React.SetStateAction<any>>
    ) => {
        return (e: Konva.KonvaEventObject<DragEvent>) => {
            console.log("DragStart");
            console.log(e.target.x(), e.target.y());

            const id = e.target.id();

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

            const endX = e.target.x();
            const endY = e.target.y();

            const newElements = elements.map((element) => {
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
        };
    };

    const canvasElementConstants = {
        perfectDrawEnabled: false,
        draggable: view === APP_VIEW.select,
    };

    function debug(e: KeyboardEvent) {}

    document.addEventListener("keydown", debug);

    // Side effect for canvas state
    useEffect(() => {
        console.log("saving canvas state to local storage");

        persistance.persistCanvasState(images);
    }, [images]);

    // Side effect for UI state
    useEffect(() => {
        persistance.persistUiState(uiState);
    }, [uiState]);

    const toggleLeftPanel = () => {
        setUiState({
            ...uiState,
            isLeftPanelOpen: !uiState.isLeftPanelOpen,
        });
    };

    const toggleRightPanel = () => {
        setUiState({
            ...uiState,
            isRightPanelOpen: !uiState.isRightPanelOpen,
        });
    };

    return (
        <div>
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
                <ActivityPanel
                    activity={activity}
                    isOpen={uiState.isLeftPanelOpen}
                    handleToggle={toggleLeftPanel}
                />
                <ElementsPanel
                    activity={activity}
                    images={images}
                    setImages={setImages}
                    stageRef={stageRef}
                    isOpen={uiState.isRightPanelOpen}
                    handleToggle={toggleRightPanel}
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
                onWheel={handleWheel}
                ref={stageRef}
                fill={commentView.state.backgroundColor}
                {...stageConstants}
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
                                offset={image.offset}
                                image={image.image}
                                onDragStart={handleDragStart(images, setImages)}
                                onDragEnd={handleDragEnd(images, setImages)}
                                {...canvasElementConstants}
                            />
                        );
                    })}
                </Layer>
                <Layer id="comment-layer"></Layer>
            </Stage>
        </div>
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
