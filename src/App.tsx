import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Image } from "react-konva";
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
import {
    CommentViewProp,
    ImageProp,
    CanvasStateProp,
    AppStateProp,
    CanvasStateStringsProp,
} from "./utils/interfaces";

const activity = activity_visual_strategies;

// TODO: move to utils
const LOCALSTORAGE_CANVAS_STATE_KEY = "visual-toolkit-canvas";
const LOCALSTORAGE_APP_STATE_KEY = "visual-toolkit-ui";

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
    // Canvas State (images)
    const [images, setImages] = useState<ImageProp[]>(() => {
        const saved = retrieveCanvasState();
        if (saved !== undefined) {
            return saved.images;
        } else return [];
    });

    // App State (stage position, zoom, view, panels)
    // Center Canvas
    const { width, height } = activity_visual_strategies.canvas_size;
    const offsetX = -(window.innerWidth - width) / 2;
    const offsetY = -(window.innerHeight - height) / 2;

    const [appState, setAppState] = useState<AppStateProp>({
        stagePosition: { x: -offsetX, y: -offsetY },
        scaleX: 1,
        view: APP_VIEW.select,
        isLeftPanelOpen: true,
        isRightPanelOpen: true,
    });

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
            const id = e.target.id();

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

    // function persistCanvasActionWrapper(canvasAction: Function) {
    //     return (input: any) => {
    //         console.log("persisting canvas action");
    //         canvasAction(input);
    //         persistCanvasState(stateRef.current);
    //     };
    // }

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
        draggable: view !== APP_VIEW.pan,
    };

    function debug(e: KeyboardEvent) {
        if (e.key === "0") {
            console.log("clear local storage");
            window.localStorage.removeItem(LOCALSTORAGE_CANVAS_STATE_KEY);
            window.localStorage.removeItem(LOCALSTORAGE_APP_STATE_KEY);
        } else if (e.key === "1") {
            console.log("saving canvas to local storage");
            persistCanvasState(images);
        } else if (e.key === "2") {
            console.log("save app state to local storage");
            persistAppState();
        } else if (e.key === "3") {
            console.log("load canvas from local storage");
            const canvasState = retrieveCanvasState();

            if (canvasState !== undefined) {
                updateCanvasState(canvasState);
            }
        } else if (e.key === "4") {
            console.log("load app state from local storage");
            const appState = retrieveAppState();
            updateAppState(appState);
        } else if (e.key === "5") {
            console.log("print canvas state and app state");
            console.log(images);
            console.log(appState);
        }
    }

    document.addEventListener("keydown", debug);

    function reconstructImagesFromJSON(imagesJSON: string): ImageProp[] {
        const images = JSON.parse(imagesJSON);
        const reconstructedImages: ImageProp[] = images.map(
            (image: ImageProp) => {
                const imageElement = new window.Image();
                imageElement.width = image.width;
                imageElement.height = image.height;
                imageElement.src = image.src;
                return {
                    ...image,
                    image: imageElement,
                };
            }
        );
        return reconstructedImages;
    }

    // Saves each canvas layer/group as string, then stringify canvasState and save to local storage
    function persistCanvasState(images: ImageProp[]) {
        window.localStorage.setItem(
            LOCALSTORAGE_CANVAS_STATE_KEY,
            JSON.stringify({
                images: JSON.stringify(images),
            })
        );
    }

    // Returns reconstructed canvas state from local storage
    function retrieveCanvasState() {
        const canvasStateJSON = window.localStorage.getItem(
            LOCALSTORAGE_CANVAS_STATE_KEY
        );

        if (canvasStateJSON !== null) {
            const canvasStateStringFields: CanvasStateStringsProp =
                JSON.parse(canvasStateJSON);

            const persistedCanvasState = {
                images: reconstructImagesFromJSON(
                    canvasStateStringFields.images
                ),
            };

            return persistedCanvasState;
        }
    }

    // update app's current canvas
    function updateCanvasState(canvasState: CanvasStateProp) {
        setImages(canvasState.images);
    }

    // save app state to local storage
    function persistAppState() {
        window.localStorage.setItem(
            LOCALSTORAGE_APP_STATE_KEY,
            JSON.stringify(appState)
        );
    }

    function retrieveAppState(): AppStateProp {
        const appStateJSON = window.localStorage.getItem(
            LOCALSTORAGE_APP_STATE_KEY
        );
        if (appStateJSON !== null) {
            const persistedAppState = JSON.parse(appStateJSON);
            return persistedAppState;
        } else return appState;
    }

    function updateAppState(appState: AppStateProp) {
        setAppState(appState);

        setView(appState.view);
        if (stageRef.current !== null) {
            const stage = stageRef.current;
            stage.setAbsolutePosition(appState.stagePosition);
            stage.scale({
                x: appState.scaleX,
                y: appState.scaleX,
            });
        }
    }

    // Load local storage on inital render
    useEffect(() => {
        console.log("loading from local storage");

        const canvasState = retrieveCanvasState();
        if (canvasState !== undefined) {
            console.log("canvas state found", canvasState);
            updateCanvasState(canvasState);
        }

        zoomFit();
        // const appState = retrieveAppState();
        // if (appState !== undefined) {
        //     persistAppState();
        //     updateAppState(appState);
        // }
    }, []);

    useEffect(() => {
        console.log("saving canvas state to local storage");

        persistCanvasState(images);
    }, [images]);

    // Saves current canvas state
    // useEffect(() => {
    //     console.log("saving canvas state to local storage");
    //     persistCanvasState();
    // }, [images /* comments, shapes, etc */]);

    // Saves current app state
    // useEffect(() => {
    //     console.log("saving app state to local storage");
    //     persistAppState();
    // }, [appState]);

    const toggleLeftPanel = () => {
        setAppState({
            ...appState,
            isLeftPanelOpen: !appState.isLeftPanelOpen,
        });
    };

    const toggleRightPanel = () => {
        setAppState({
            ...appState,
            isRightPanelOpen: !appState.isRightPanelOpen,
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
                    isOpen={appState.isLeftPanelOpen}
                    handleToggle={toggleLeftPanel}
                />
                <ElementsPanel
                    activity={activity}
                    images={images}
                    setImages={setImages}
                    stageRef={stageRef}
                    isOpen={appState.isRightPanelOpen}
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
