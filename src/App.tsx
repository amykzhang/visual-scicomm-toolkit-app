import { useCallback, useEffect, useRef, useState } from "react";
import { Stage, Layer, Group, Rect } from "react-konva";
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
import {
    CommentProp,
    ImageProp,
    SelectionBoundsProp,
    ShapeProp,
    UiStateProp,
} from "./utils/interfaces";
import { persistance } from "./functions";
import { ImageElement } from "./Elements";
import { ExportPanel } from "./Panels";
import CommentElement from "./Elements/CommentElement";
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
            selectionRef.current = [];
        }
    }

    // images
    const [images, setImages] = useState<ImageProp[]>(() => {
        const saved = persistance.retrieveCanvasState();

        if (saved !== undefined && saved.images !== undefined) {
            return saved.images;
        } else return [];
    });

    // shapes
    const [shapes, setShapes] = useState<ShapeProp[]>(() => {
        const saved = persistance.retrieveCanvasState();

        if (saved !== undefined && saved.shapes !== undefined) {
            return saved.shapes;
        } else return [];
    });

    // Group Selection
    const selectionRef = useRef<string[]>([]);

    // Drag Select
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectionBounds, setSelectionBounds] = useState<SelectionBoundsProp>({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    });

    // "Global" transform flag (for isolating drag selecting elements)
    const [transformFlag, setTransformFlag] = useState(true);

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
    const { handleSelect, deleteSelected, updateResetGroup } = SelectionManager(
        images,
        setImages,
        view,
        shiftKey,
        selectionRef,
        groupRef
    );

    // Comment View
    const {
        commentViewState,
        selectedComment,
        setSelectedComment,
        enterCommentView,
        exitCommentView,
        handleCommentViewClickOff,
    } = CommentViewManager(setView, comments, setComments, stageRef);

    // Key Presses
    const handleKeyPress = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                selectionRef.current = [];
            }
            if (e.key === "Delete" || e.key === "Backspace") {
                if (commentViewState.active) {
                    if (selectedComment !== null) {
                        setComments(comments.filter((comment) => comment.id !== selectedComment));
                        setSelectedComment(null);
                    }
                } else {
                    if (selectionRef.current.length > 0) {
                        deleteSelected();
                    }
                }
            }
            if (e.key === "a" && ctrlKey) {
                e.preventDefault();
                selectionRef.current = images.map((image) => image.id);
            }
            if (e.key === "=") {
                console.log("debug");
            }
        },
        [
            ctrlKey,
            images,
            deleteSelected,
            selectionRef,
            commentViewState.active,
            selectedComment,
            comments,
            setSelectedComment,
        ]
    );

    // Export
    const startExportProcess = ExportManager(activity, stageRef, setTransformFlag);

    // Dragging Behaviour depending on View
    const stageConstants = {
        draggable: view === APP_VIEW.pan,
    };

    // Side effect for canvas state
    useEffect(() => {
        persistance.persistCanvasState(images, shapes, comments);
    }, [images, shapes, comments]);

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
    }, [shiftKey, ctrlKey, altKey, metaKey, handleKeyPress]);

    // For Comment View
    useEffect(() => {
        if (stageRef.current !== null) {
            const stage = stageRef.current;
            const container = stage.getContent();
            container.style.backgroundColor = commentViewState.backgroundColor;

            // update comment selection
            setSelectedComment(null);
        }
    }, [commentViewState, stageRef, setSelectedComment]);

    return (
        <div>
            <PanelsContainer>
                <TopZone>
                    <TitlePanel name={activity.name} />
                    <ToolbarPanel
                        view={view}
                        setView={setView}
                        exitCommentView={exitCommentView}
                        enterCommentView={enterCommentView}
                        commentViewState={commentViewState}
                    />
                    <ExitCommentView
                        commentViewState={commentViewState}
                        exitCommentView={exitCommentView}
                    />
                    <ExportPanel activity={activity} startExportProcess={startExportProcess} />
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
                    shapes={shapes}
                    setShapes={setShapes}
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
                    commentViewState.active
                        ? handleCommentViewClickOff
                        : (e) => {
                              if (view === APP_VIEW.select) {
                                  if (e.target === stageRef.current) {
                                      selectionRef.current = [];
                                  }
                              }
                          }
                }
                onMouseDown={(e) => {
                    if (view === APP_VIEW.select && stageRef.current !== null) {
                        const stage = stageRef.current;

                        // Only start bounding box drag select if user clicks on stage or export area
                        if (e.target === stage || e.target === exportAreaRef.current) {
                            setIsSelectionMode(true);

                            const pointerPosition = stage.getPointerPosition();
                            if (pointerPosition !== null) {
                                const x = (pointerPosition.x - stage.x()) / stage.scaleX();
                                const y = (pointerPosition.y - stage.y()) / stage.scaleX();
                                setSelectionBounds({
                                    x,
                                    y,
                                    width: 0,
                                    height: 0,
                                });
                            }
                        }
                    }
                }}
                onMouseMove={(e) => {
                    if (isSelectionMode && stageRef.current !== null) {
                        const stage = stageRef.current;
                        const pointerPosition = stage.getPointerPosition();

                        if (pointerPosition !== null) {
                            const x = (pointerPosition.x - stage.x()) / stage.scaleX();
                            const y = (pointerPosition.y - stage.y()) / stage.scaleX();
                            const width = x - selectionBounds.x;
                            const height = y - selectionBounds.y;
                            setSelectionBounds({
                                ...selectionBounds,
                                width,
                                height,
                            });
                        }
                    }
                }}
                onMouseUp={(e) => {
                    if (isSelectionMode && view === APP_VIEW.select) {
                        setIsSelectionMode(false);

                        // Get Elements within bounds
                        selectionRef.current = getElementsWithinBounds(selectionBounds, images);
                    }
                }}
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
                                selectionRef.current = [];
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
                <Layer id="image-layer">
                    {images
                        .filter((image) => !selectionRef.current.includes(image.id))
                        .map((image: ImageProp, i: number) => {
                            return (
                                <ImageElement
                                    draggable={view === APP_VIEW.select}
                                    key={i}
                                    image={image}
                                    isSelected={selectionRef.current.includes(image.id)}
                                    handleChange={(attributes: any) => {
                                        modifyImage(i, {
                                            ...image,
                                            ...attributes,
                                        });
                                    }}
                                    handleSelect={handleSelect}
                                    handleDragStart={handleDragStart(images, setImages)}
                                    handleDragEnd={handleDragEnd(images, setImages)}
                                    transformFlag={transformFlag}
                                    setTransformFlag={setTransformFlag}
                                    selectionRef={selectionRef}
                                    updateResetGroup={updateResetGroup}
                                />
                            );
                        })}
                    {shapes
                        .filter(
                            (shape) =>
                                !selectionRef.current.includes(shape.id) && shape.type === "rect"
                        )
                        .map((shape: ShapeProp, i: number) => {
                            return <Rect {...shape} key={i} draggable={view === APP_VIEW.select} />;
                        })}

                    <Group
                        draggable
                        ref={groupRef}
                        onDragEnd={(e) => {
                            updateResetGroup();
                        }}
                    >
                        {selectionRef.current.map((id) => {
                            const idx = images.findIndex((image) => image.id === id);
                            if (idx === -1) return null;
                            const image = images[idx];
                            return (
                                <ImageElement
                                    draggable={false}
                                    key={idx}
                                    image={image}
                                    isSelected={selectionRef.current.includes(image.id)}
                                    handleChange={(attributes: any) => {
                                        modifyImage(idx, {
                                            ...image,
                                            ...attributes,
                                        });
                                    }}
                                    handleSelect={handleSelect}
                                    transformFlag={transformFlag}
                                    setTransformFlag={setTransformFlag}
                                    selectionRef={selectionRef}
                                    updateResetGroup={updateResetGroup}
                                />
                            );
                        })}
                    </Group>
                </Layer>
                <Layer id="comment-layer">
                    {commentViewState.active &&
                        comments.map((comment, i) => {
                            return (
                                <CommentElement
                                    draggable={view === APP_VIEW.select}
                                    key={i}
                                    selected={selectedComment === comment.id}
                                    comment={comment}
                                    comments={comments}
                                    setComments={setComments}
                                    stageRef={stageRef}
                                    handleSelect={() => setSelectedComment(comment.id)}
                                />
                            );
                        })}
                </Layer>
            </Stage>
        </div>
    );
}

interface ExitCommentStateProps {
    commentViewState: { active: boolean };
    exitCommentView: () => void;
}

const ExitCommentView: React.FC<ExitCommentStateProps> = ({
    commentViewState,
    exitCommentView,
}) => {
    const displayStyle = commentViewState.active ? {} : { display: "none" };

    return (
        <ExitCommentViewButton style={displayStyle} onClick={exitCommentView}>
            <typography.LargeText>Exit Comment Mode</typography.LargeText>
        </ExitCommentViewButton>
    );
};

function getElementsWithinBounds(selectionBounds: SelectionBoundsProp, images: ImageProp[]) {
    const actualBounds = {
        x:
            selectionBounds.width > 0
                ? selectionBounds.x
                : selectionBounds.x + selectionBounds.width,
        y:
            selectionBounds.height > 0
                ? selectionBounds.y
                : selectionBounds.y + selectionBounds.height,
        width: Math.abs(selectionBounds.width),
        height: Math.abs(selectionBounds.height),
    };

    const newSelection = images
        .filter(
            (image) =>
                image.x > actualBounds.x &&
                image.y > actualBounds.y &&
                image.x + image.width < actualBounds.x + actualBounds.width &&
                image.y + image.height < actualBounds.y + actualBounds.height
        )
        .map((image) => image.id);
    return newSelection;
}
