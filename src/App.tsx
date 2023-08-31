import { useEffect, useState } from "react";
import { Stage, Layer, Image, StageProps } from "react-konva";
import styled from "styled-components";
import { ExportManager, KeyPressManager, StageViewManager } from "./functions";
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
import { persistance } from "./functions";
import { ImageElement } from "./Elements";
import { KonvaEventObject } from "konva/lib/Node";
import { ExportPanel } from "./Panels";

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
    const { shiftKey, ctrlKey, altKey, metaKey } = KeyPressManager();

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
        if (view !== APP_VIEW.select) {
            setSelectedIds([]);
        }
    };

    // Canvas State (images)
    const [images, setImages] = useState<ImageProp[]>(() => {
        const saved = persistance.retrieveCanvasState();

        if (saved !== undefined) {
            return saved.images;
        } else return [];
    });

    // Splices the indexed imaged with the new image
    const modifyImage = (idx: number, newImage: ImageProp) => {
        const newImages = images.slice();
        newImages[idx] = newImage;
        setImages(newImages);
    };

    // selected Ids
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const addSelectedId = (id: number) => {
        console.log(id);
        setSelectedIds([...selectedIds, id]);
    };

    const removeSelectedId = (id: number) => {
        console.log(id);
        setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    };

    const toggleSelectedId = (id: number) => {
        if (selectedIds.includes(id)) {
            removeSelectedId(id);
        } else {
            addSelectedId(id);
        }
    };

    const handleSelect = (id: number) => {
        if (view === APP_VIEW.select) {
            if (shiftKey) {
                toggleSelectedId(id);
            } else {
                if (selectedIds.length === 1 && selectedIds.includes(id)) {
                    setSelectedIds([]);
                } else {
                    setSelectedIds([id]);
                }
            }
        }
    };

    const handleUnfocus = (e: KonvaEventObject<MouseEvent>) => {
        if (view === APP_VIEW.select) {
            const clickedOnEmpty = e.target === stageRef.current;
            if (clickedOnEmpty) {
                setSelectedIds([]);
            }
        }
    };

    const deleteSelected = () => {
        const newImages = images.filter((_, i) => !selectedIds.includes(i));
        setImages(newImages);
        setSelectedIds([]);
    };

    // Key Presses
    const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === "d") {
            //debug
            console.log(selectedIds);
            console.log(uiState);
            console.log(images);
        }
        if (e.key === "Escape") {
            setSelectedIds([]);
        } else if (e.key === "Backspace") {
            deleteSelected();
        } else if (e.key === "Delete") {
            if (selectedIds.length > 0) {
                deleteSelected();
            }
        } else if (e.key === "a" && ctrlKey) {
            e.preventDefault();
            setSelectedIds(images.map((_, i) => i));
        }
    };

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

    // Export
    const { exportCanvas } = ExportManager(stageRef, activity);

    // Comment View
    const commentView = CommentViewManager(setView);

    // Dragging Behaviour depending on View
    const stageConstants = {
        draggable: view === APP_VIEW.pan,
    };

    const canvasElementConstants = {
        perfectDrawEnabled: false,
        draggable: view === APP_VIEW.select,
    };

    // Side effect for canvas state
    useEffect(() => {
        persistance.persistCanvasState(images);
    }, [images]);

    // Side effect for UI state
    useEffect(() => {
        persistance.persistUiState(uiState);
    }, [uiState]);

    // Selected ID key press listeners
    useEffect(() => {
        window.addEventListener("keyup", handleKeyPress);

        return () => {
            window.removeEventListener("keyup", handleKeyPress);
        };
    }, [selectedIds, shiftKey, ctrlKey, altKey, metaKey]);

    return (
        <div>
            <PanelsContainer>
                <TopZone>
                    <TitlePanel name={activity.name} />
                    <ToolbarPanel
                        view={view}
                        setView={setView}
                        commentView={commentView}
                    />
                    <ExitCommentView commentView={commentView} />
                    <ExportPanel
                        exportCanvas={exportCanvas}
                        activity={activity}
                    />
                </TopZone>
                <ActivityPanel
                    activity={activity}
                    isOpen={uiState.isLeftPanelOpen}
                    handleToggle={() => {
                        setUiState({
                            ...uiState,
                            isLeftPanelOpen: !uiState.isLeftPanelOpen,
                        });
                    }}
                />
                <ElementsPanel
                    activity={activity}
                    images={images}
                    setImages={setImages}
                    stageRef={stageRef}
                    isOpen={uiState.isRightPanelOpen}
                    handleToggle={() => {
                        setUiState({
                            ...uiState,
                            isRightPanelOpen: !uiState.isRightPanelOpen,
                        });
                    }}
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
                onClick={handleUnfocus}
                ref={stageRef}
                fill={commentView.state.backgroundColor}
                {...stageConstants}
            >
                <Layer id="export-layer">
                    <ExportArea
                        {...activity.canvas_size}
                        onClick={() => setSelectedIds([])}
                    />
                </Layer>
                <Layer id="image-layer">
                    {images.map((image, i) => {
                        return (
                            <ImageElement
                                {...canvasElementConstants}
                                key={i}
                                imageProps={image}
                                isSelected={selectedIds.includes(i)}
                                onSelect={() => handleSelect(i)}
                                onChange={(newAttrs: any) => {
                                    modifyImage(i, {
                                        ...image,
                                        ...newAttrs,
                                    });
                                }}
                                images={images}
                                setImages={setImages}
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
