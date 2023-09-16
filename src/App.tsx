import { useCallback, useEffect, useRef, useState } from "react";
import { Stage, Layer, Group } from "react-konva";
import { PanelsContainer } from "./styles/containers";
import {
    ExportManager,
    KeyPressManager,
    SelectionManager,
    StageViewManager,
    handleDragEnd,
    handleDragStart,
} from "./functions";
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
import { CommentProp, CommentViewProp, ImageProp, UiStateProp } from "./utils/interfaces";
import { persistance } from "./functions";
import { ImageElement } from "./Elements";
import { ExportPanel } from "./Panels";
import CommentElement from "./Elements/CommentElement";
import { handleAddComment } from "./functions/comment";
import Konva from "konva";
import { SelectionRect } from "./components/SelectionRect";

// TODO: make this easier to customize, more modular for creators?
const activity = activity_visual_strategies;

export default function App() {
    const groupRef = useRef<Konva.Group>(null);
    const exportAreaRef = useRef<Konva.Rect>(null);
    const selectionRectRef = useRef<Konva.Rect>(null);

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
    function setView(view: APP_VIEW) {
        setUiState({ ...uiState, view: view });
        if (view !== APP_VIEW.select) {
            setGroupSelection([]);
        }
    }

    // images
    const [images, setImages] = useState<ImageProp[]>(() => {
        const saved = persistance.retrieveCanvasState();

        if (saved !== undefined && saved.images !== undefined) {
            return saved.images;
        } else return [];
    });

    // comments
    const [comments, setComments] = useState<CommentProp[]>(() => {
        const saved = persistance.retrieveCanvasState();

        if (saved !== undefined && saved.comments !== undefined) {
            return saved.comments;
        } else {
            return [
                // {
                //     id: "0",
                //     x: 100,
                //     y: 100,
                //     isDragging: false,
                //     isEditing: false,
                //     text: "Hello World!",
                // },
            ];
        }
    });

    // Splices the indexed imaged with the new image
    const modifyImage = (idx: number, newImage: ImageProp) => {
        const newImages = images.slice();
        newImages[idx] = newImage;
        setImages(newImages);
    };

    // Stage View
    const { stageRef, handleWheel, zoomLevel, zoomIn, zoomOut, zoomFit, toggleFullscreen } =
        StageViewManager(activity.canvas_size);

    // Selection
    const {
        groupSelection,
        setGroupSelection,
        isSelectionMode,
        selectionBounds,
        handleSelect,
        deleteSelected,
        updateResetGroup,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
    } = SelectionManager(images, setImages, view, shiftKey, stageRef, groupRef, selectionRectRef);

    // Key Presses
    const handleKeyPress = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setGroupSelection([]);
            } else if (e.key === "Backspace") {
                deleteSelected();
            } else if (e.key === "Delete") {
                if (groupSelection.length > 0) {
                    deleteSelected();
                }
            } else if (e.key === "a" && ctrlKey) {
                e.preventDefault();
                setGroupSelection(images.map((image) => image.id));
            } else if (e.key === "=") {
                console.log(groupSelection);
            }
        },
        [ctrlKey, images, deleteSelected, groupSelection, setGroupSelection]
    );

    // Comment View
    const commentView = CommentViewManager(setView);

    // Export
    const exportManager = ExportManager(activity, stageRef, groupSelection, setGroupSelection);

    // Dragging Behaviour depending on View
    const stageConstants = {
        draggable: view === APP_VIEW.pan,
    };

    // Side effect for canvas state
    useEffect(() => {
        persistance.persistCanvasState(images, comments);
    }, [images, comments]);

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
    }, [groupSelection, shiftKey, ctrlKey, altKey, metaKey, handleKeyPress]);

    // For Comment View
    useEffect(() => {
        if (stageRef.current !== null) {
            const stage = stageRef.current;

            const container = stage.getContent();
            container.style.backgroundColor = commentView.state.backgroundColor;
        }
    }, [commentView.state.backgroundColor, stageRef]);

    const [transformFlag, setTransformFlag] = useState(true);

    return (
        <div>
            <PanelsContainer>
                <TopZone>
                    <TitlePanel name={activity.name} />
                    <ToolbarPanel view={view} setView={setView} commentView={commentView} />
                    <ExitCommentView commentView={commentView} />
                    <ExportPanel activity={activity} exportManager={exportManager} />
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
                onClick={
                    // handle unfocus
                    commentView.state.active
                        ? handleAddComment(comments, setComments, stageRef)
                        : (e) => {
                              if (view === APP_VIEW.select) {
                                  const clickedOnStage = e.target === stageRef.current;
                                  if (clickedOnStage) {
                                      updateResetGroup();
                                      setGroupSelection([]);
                                  }
                              }
                          }
                }
                onMouseDown={view === APP_VIEW.select ? handleMouseDown : undefined}
                onMouseMove={view === APP_VIEW.select ? handleMouseMove : undefined}
                onMouseUp={view === APP_VIEW.select ? handleMouseUp : undefined}
                onContextMenu={(e) => {
                    e.evt.preventDefault();
                }}
                ref={stageRef}
                {...stageConstants}
            >
                <Layer>
                    <ExportArea
                        exportAreaRef={exportAreaRef}
                        {...activity.canvas_size}
                        onClick={() => {
                            if (view === APP_VIEW.select) {
                                updateResetGroup();
                                setGroupSelection([]);
                            }
                        }}
                    />
                    {isSelectionMode && view === APP_VIEW.select && (
                        <SelectionRect
                            selectionRectRef={selectionRectRef}
                            x={selectionBounds.x}
                            y={selectionBounds.y}
                            width={selectionBounds.width}
                            height={selectionBounds.height}
                        />
                    )}
                </Layer>
                <Layer id="comment-layer">
                    {commentView.state.active &&
                        comments.map((comment, i) => {
                            return (
                                <CommentElement
                                    draggable={view === APP_VIEW.select}
                                    key={i}
                                    comment={comment}
                                    comments={comments}
                                    setComments={setComments}
                                />
                            );
                        })}
                </Layer>
                <Layer id="image-layer">
                    {images
                        .filter((image) => !groupSelection.includes(image.id))
                        .map((image: ImageProp, i: number) => {
                            return (
                                <ImageElement
                                    draggable={view === APP_VIEW.select}
                                    key={i}
                                    image={image}
                                    isSelected={groupSelection.includes(image.id)}
                                    selectSelf={() => {
                                        handleSelect(image.id);
                                    }}
                                    onChange={(attributes: any) => {
                                        modifyImage(i, {
                                            ...image,
                                            ...attributes,
                                        });
                                    }}
                                    handleDragStart={handleDragStart(images, setImages)}
                                    handleDragEnd={handleDragEnd(images, setImages)}
                                    transformFlag={transformFlag}
                                    setTransformFlag={setTransformFlag}
                                    setGroupSelection={setGroupSelection}
                                    updateResetGroup={updateResetGroup}
                                />
                            );
                        })}

                    <Group draggable ref={groupRef}>
                        {groupSelection.map((id) => {
                            const idx = images.findIndex((image) => image.id === id);
                            const image = images[idx];
                            return (
                                <ImageElement
                                    draggable={false}
                                    key={idx}
                                    image={image}
                                    isSelected={groupSelection.includes(image.id)}
                                    selectSelf={() => handleSelect(image.id)}
                                    onChange={(attributes: any) => {
                                        modifyImage(idx, {
                                            ...image,
                                            ...attributes,
                                        });
                                    }}
                                    transformFlag={transformFlag}
                                    setTransformFlag={setTransformFlag}
                                    setGroupSelection={setGroupSelection}
                                    updateResetGroup={updateResetGroup}
                                />
                            );
                        })}
                    </Group>
                </Layer>
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
