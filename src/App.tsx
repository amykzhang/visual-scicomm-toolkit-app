import { useEffect, useState } from "react";
import { Stage, Layer, Image } from "react-konva";
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
import {
    CommentViewProp,
    ImageProp,
    canvasStateProp,
    uiStateProp,
} from "./utils/interfaces";

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

    function debug(e: KeyboardEvent) {
        if (e.key === "1") {
            console.log("save to local storage");
            const str = saveToLocalStorage();
            console.log(str);
        } else if (e.key === "2") {
            console.log("load from local storage");
            const canvasState = loadFromLocalStorage();
            setCanvasState(canvasState);
        } else if (e.key === "3") {
            console.log("clear local storage");
            window.localStorage.removeItem(localKey);
        } else if (e.key === "4") {
            console.log("print uistate");
            console.log(uiState);
        }
    }

    document.addEventListener("keydown", debug);

    // UI State
    const [uiState, setUiState] = useState<uiStateProp>({
        view: STAGE_VIEW.select,
        isLeftPanelOpen: true,
        isRightPanelOpen: true,
    });

    function toJSON(elements: ImageProp[]) {
        return JSON.stringify(elements);
    }

    function reconstructImagesFromJSON(imagesJSON: string) {
        const images = JSON.parse(imagesJSON);
        const reconstructedImages = images.map((image: ImageProp) => {
            const imageElement = new window.Image();
            imageElement.width = image.width;
            imageElement.height = image.height;
            imageElement.src = image.src;
            return {
                ...image,
                image: imageElement,
            };
        });
        return reconstructedImages;
    }

    function saveToLocalStorage() {
        if (stageRef.current !== null) {
            const stage = stageRef.current;

            const canvasState = {
                images: toJSON(images),
                stagePosition: stage.getAbsolutePosition(),
                zoomLevel: zoomLevel,
                uiState: uiState,
            };
            const canvasStateJSON = JSON.stringify(canvasState);

            window.localStorage.setItem(localKey, canvasStateJSON);
            return canvasStateJSON;
        }
    }

    function loadFromLocalStorage() {
        const canvasStateJSON = window.localStorage.getItem(localKey);
        if (canvasStateJSON !== null) {
            const canvasState = JSON.parse(canvasStateJSON);
            return canvasState;
        }
    }

    function setCanvasState(canvasState: canvasStateProp) {
        const reconstructedImages = reconstructImagesFromJSON(
            canvasState.images
        );
        setImages(reconstructedImages);
        setView(canvasState.uiState.view);
        setUiState(canvasState.uiState);

        if (stageRef.current !== null) {
            const stage = stageRef.current;
            stage.setAbsolutePosition(canvasState.stagePosition);
            stage.scale({
                x: canvasState.zoomLevel / 100,
                y: canvasState.zoomLevel / 100,
            });
        }
    }

    // Load Images from Local Storage
    useEffect(() => {
        const canvasState = loadFromLocalStorage();
        if (canvasState !== undefined) {
            setCanvasState(canvasState);
        }
    }, []);

    const toggleLeftPanel = () => {
        setUiState({ ...uiState, isLeftPanelOpen: !uiState.isLeftPanelOpen });
    };

    const toggleRightPanel = () => {
        setUiState({ ...uiState, isRightPanelOpen: !uiState.isRightPanelOpen });
    };

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
                draggable={true}
                onWheel={handleWheel}
                ref={stageRef}
                fill={commentView.state.backgroundColor}
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
