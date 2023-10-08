import React, { useCallback, useEffect, useRef, useState } from "react";
import { Stage, Layer, Group } from "react-konva";
import { PanelsContainer } from "./styles/containers";
import {
    ExportManager,
    SelectionManager,
    StageViewManager,
    TextViewManager,
    getElementsWithinBounds,
    handleDragEnd,
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
    CanvasStateProp,
    CommentProp,
    ElementProp,
    ImageProp,
    SelectionBoundsProp,
    ShapeProp,
    TextProp,
    UiStateProp,
} from "./utils/interfaces";
import { persistance } from "./utils/persistance";
import { ImageElement, CommentElement, ShapeElement, TextElement } from "./Elements";
import { ExportPanel } from "./Panels";
import Konva from "konva";
import { SelectionRect } from "./components/SelectionRect";
import color from "./styles/color";

const activity = activity_visual_strategies;

const initialCanvasState = persistance.retrieveCanvasState();
const initialUiState = persistance.retrieveUiState();

interface HistoryProp {
    canvas: CanvasStateProp;
    selection: string[];
}

let history: HistoryProp[] = [
    {
        canvas: initialCanvasState,
        selection: [],
    },
];
let historyStep = 0;

export default function App() {
    const groupRef = useRef<Konva.Group>(null);
    const exportAreaRef = useRef<Konva.Rect>(null);
    const selectionRectRef = useRef<Konva.Rect>(null);

    const [shiftKey, setShiftKey] = useState(false);

    // App State (stage position, zoom, view, panels)
    const [uiState, setUiState] = useState<UiStateProp>(initialUiState);

    const view = uiState.view;
    const setView = useCallback(
        (view: APP_VIEW) => {
            setUiState({ ...uiState, view: view });
            if (view !== APP_VIEW.select) {
                setGroupSelection([]);
            }
        },
        [uiState]
    );

    // Dragging Behaviour depending on View
    const stageConstants = {
        draggable: view === APP_VIEW.pan,
    };

    // Stage View
    const { stageRef, handleWheel, zoomLevel, zoomIn, zoomOut, zoomFit, toggleFullscreen } =
        StageViewManager(activity.canvas_size);

    // --- CANVAS STATE ---

    const [elements, setElements] = useState<ElementProp[]>(history[0].canvas.elements);
    const [comments, setComments] = useState<CommentProp[]>(history[0].canvas.comments);

    // Group Selection
    const [groupSelection, setGroupSelection] = useState<string[]>(history[0].selection);

    // Drag Select
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectionBounds, setSelectionBounds] = useState<SelectionBoundsProp>({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    });
    const [elementsWithinBounds, setElementsWithinBounds] = useState<string[]>([]);

    // App wide transform flag (for isolating drag selecting elements)
    const [transformFlag, setTransformFlag] = useState(true);

    // --- MANAGERS FOR VIEWS ---

    // Selection
    const { handleSelect, deleteSelected, updateResetGroup } = SelectionManager(
        elements,
        setElements,
        view,
        setView,
        shiftKey,
        groupSelection,
        setGroupSelection,
        groupRef
    );

    const {
        selectedComment,
        setSelectedComment,
        handleCommentViewClickOff,
        editComment,
        isEditingComment,
    } = CommentViewManager(comments, setComments, stageRef);

    const { toggleTextMode, handleTextClick, editText, isEditingText, justCreated } =
        TextViewManager(
            view,
            setView,
            elements,
            setElements,
            stageRef,
            groupSelection,
            setGroupSelection
        );

    // -- KEY PRESSES --
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Shift") setShiftKey(true);

            if (groupSelection !== null) {
                // SELECT VIEW
                if (view === APP_VIEW.select) {
                    if (isEditingText) {
                        return;
                    }
                    switch (e.key) {
                        case "a":
                            if (e.metaKey) {
                                setGroupSelection(elements.map((element) => element.id));
                                setElements(elements.slice()); // force update (TODO: FIX HACK)
                            }
                            break;
                        case "Escape":
                            setGroupSelection([]);
                            setElements(elements.slice());
                            break;
                        case "Delete":
                        case "Backspace":
                            if (!e.metaKey) {
                                deleteSelected();
                            }
                            break;
                        // TODO: remove shortcut
                        case "t":
                            if (e.metaKey) {
                                setView(APP_VIEW.text);
                            }
                            break;
                        default:
                            break;
                    }
                }
                // PAN VIEW
                else if (view === APP_VIEW.pan) {
                    switch (e.key) {
                        case "Escape":
                            setView(APP_VIEW.select);
                            break;
                        // TODO: remove shortcut
                        case "t":
                            setView(APP_VIEW.text);
                            break;
                        // TODO: remove shortcut
                        case "v":
                            setView(APP_VIEW.select);
                            break;
                        default:
                            break;
                    }
                    // TEXT VIEW
                } else if (view === APP_VIEW.text) {
                    switch (e.key) {
                        case "Escape":
                            setView(APP_VIEW.select);
                            break;
                        // TODO: remove shortcut
                        case "v":
                            setView(APP_VIEW.select);
                            break;
                        default:
                            break;
                    }
                    // COMMENT VIEW
                } else if (view === APP_VIEW.comment) {
                    if (isEditingComment) {
                        return;
                    }
                    switch (e.key) {
                        case "Delete":
                        case "Backspace":
                            if (selectedComment !== null) {
                                setComments(
                                    comments.filter((comment) => comment.id !== selectedComment)
                                );
                                setSelectedComment(null);
                            }
                            break;
                        default:
                            break;
                    }
                }
            }
        },
        [
            elements,
            comments,
            selectedComment,
            view,
            isEditingText,
            isEditingComment,
            deleteSelected,
            setSelectedComment,
            setView,
            groupSelection,
        ]
    );

    const handleKeyUp = useCallback((e: KeyboardEvent) => {
        if (e.key === "Shift") setShiftKey(false);
    }, []);

    // Given an elementProp, return a ReactElement representing the type of element
    function elementToReactElement(
        element: ElementProp,
        i: number,
        group: boolean
    ): React.ReactElement {
        const draggable = view === APP_VIEW.select && !group;
        if (element.type === "image") {
            const image = element as ImageProp;
            return (
                <ImageElement
                    key={i}
                    image={image}
                    draggable={draggable}
                    handleChange={(attributes: any) => {
                        setElements([
                            ...elements.slice(0, i),
                            { ...image, ...attributes },
                            ...elements.slice(i + 1),
                        ]);
                    }}
                    handleSelect={() => handleSelect(image.id)}
                    handleDragEnd={handleDragEnd(elements, setElements)}
                    transformFlag={transformFlag}
                    setTransformFlag={setTransformFlag}
                    groupSelection={groupSelection}
                    setGroupSelection={setGroupSelection}
                />
            );
        } else if (element.type === "shape") {
            const shape = element as ShapeProp;
            return (
                <ShapeElement
                    key={i}
                    shape={shape}
                    draggable={draggable}
                    handleChange={(attributes: any) => {
                        setElements([
                            ...elements.slice(0, i),
                            { ...shape, ...attributes },
                            ...elements.slice(i + 1),
                        ]);
                    }}
                    handleSelect={() => handleSelect(shape.id)}
                    handleDragEnd={handleDragEnd(elements, setElements)}
                    transformFlag={transformFlag}
                    setTransformFlag={setTransformFlag}
                    groupSelection={groupSelection}
                    setGroupSelection={setGroupSelection}
                />
            );
        } else if (element.type === "text") {
            const text = element as TextProp;
            return (
                <TextElement
                    key={i}
                    text={text}
                    groupSelection={groupSelection}
                    setGroupSelection={setGroupSelection}
                    draggable={draggable}
                    handleChange={(attributes: any) => {
                        setElements([
                            ...elements.slice(0, i),
                            { ...text, ...attributes },
                            ...elements.slice(i + 1),
                        ]);
                    }}
                    handleSelect={() => {
                        setView(APP_VIEW.select);
                        handleSelect(text.id);
                    }}
                    handleDragEnd={handleDragEnd(elements, setElements)}
                    transformFlag={transformFlag}
                    setTransformFlag={setTransformFlag}
                    editText={editText}
                    isJustCreated={justCreated === text.id}
                />
            );
        } else return <></>;
    }

    // Handle click off stage for all views
    function handleCanvasClick(e: Konva.KonvaEventObject<MouseEvent>) {
        switch (view) {
            case APP_VIEW.select:
                setGroupSelection([]);
                setElements(elements.slice());
                break;
            case APP_VIEW.pan:
                // do something for pan view
                break;
            case APP_VIEW.comment:
                handleCommentViewClickOff(e);
                break;
            case APP_VIEW.draw:
                // do something for draw view
                break;
            case APP_VIEW.text:
                handleTextClick(e);
                break;
            default:
                break;
        }
    }

    const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (stageRef.current === null) return;
        const stage = stageRef.current;

        if (view === APP_VIEW.select) {
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
        } else if (view === APP_VIEW.draw) {
            console.log("draw mousedown");
        }
    };

    const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (stageRef.current === null) return;
        const stage = stageRef.current;

        if (view === APP_VIEW.select && isSelectionMode) {
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
        } else if (view === APP_VIEW.draw) {
            console.log("draw mousemove");
        }
    };

    const handleMouseUp = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (view === APP_VIEW.select && isSelectionMode) {
            setElementsWithinBounds(getElementsWithinBounds(selectionBounds, elements));
            setIsSelectionMode(false);
        }
        if (view === APP_VIEW.draw) {
            console.log("draw mouseup");
        }
    };

    // Group Selection
    useEffect(() => {
        setGroupSelection(elementsWithinBounds);
    }, [elementsWithinBounds]);

    // --- HISTORY ---

    const handleUndo = () => {
        if (historyStep > 0) {
            historyStep -= 1;
            setElements(history[historyStep].canvas.elements);
            setComments(history[historyStep].canvas.comments);
            setGroupSelection(history[historyStep].selection);
        }
    };

    const handleRedo = () => {
        if (historyStep < history.length - 1) {
            historyStep += 1;
            setElements(history[historyStep].canvas.elements);
            setComments(history[historyStep].canvas.comments);
            setGroupSelection(history[historyStep].selection);
        }
    };

    // Export
    const startExportProcess = ExportManager(activity, stageRef, setTransformFlag);

    // Save canvas state
    useEffect(() => {
        persistance.persistCanvasState(elements, comments);
    }, [elements, comments]);

    // Save UI state
    useEffect(() => {
        persistance.persistUiState(uiState);
    }, [uiState]);

    useEffect(() => {
        const newState = {
            canvas: { elements, comments },
            selection: groupSelection,
        };

        if (JSON.stringify(newState) !== JSON.stringify(history[historyStep])) {
            history = [...history.slice(0, historyStep + 1), newState];
            historyStep += 1;
        }
    }, [elements, comments, groupSelection]);

    // Handle key presses
    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [handleKeyDown, handleKeyUp]);

    // side effect views
    useEffect(() => {
        if (stageRef.current === null) return;
        const stage = stageRef.current;

        if (view === APP_VIEW.comment) {
            stage.getContent().style.backgroundColor = color.commentViewBackground;
        } else {
            stage.getContent().style.backgroundColor = color.canvasBackground;
        }
    }, [view, setView, stageRef]);

    // side effect for cursor
    useEffect(() => {
        switch (view) {
            case APP_VIEW.select:
                document.body.style.cursor = "default";
                break;
            case APP_VIEW.pan:
                document.body.style.cursor = "grab";
                break;
            case APP_VIEW.comment:
                document.body.style.cursor = "pointer";
                break;
            case APP_VIEW.draw:
                document.body.style.cursor = "default";
                break;
            case APP_VIEW.text:
                document.body.style.cursor = "pointer";
                break;
            default:
                document.body.style.cursor = "default";
                break;
        }
    }, [view]);

    return (
        <div>
            <PanelsContainer>
                <TopZone>
                    <TitlePanel name={activity.name} />
                    <ToolbarPanel
                        view={view}
                        setView={setView}
                        handleUndo={handleUndo}
                        handleRedo={handleRedo}
                    />
                    <ExitCommentView view={view} setView={setView} />
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
                    elements={elements}
                    setElements={setElements}
                    stageRef={stageRef}
                    isOpen={uiState.isRightPanelOpen}
                    handleToggle={() => {
                        setUiState({
                            ...uiState,
                            isRightPanelOpen: !uiState.isRightPanelOpen,
                        });
                    }}
                    toggleTextMode={toggleTextMode}
                    view={view}
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
                // handle unfocus/click on stage
                onClick={(e) => {
                    if (e.target === stageRef.current) handleCanvasClick(e);
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
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
                        // handle unfocus/click on stage (for export area since it is a rect element technically)
                        onClick={handleCanvasClick}
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
                <Layer id="elements-layer">
                    {elements
                        .filter((element) => !groupSelection.includes(element.id))
                        .map((element, i) => elementToReactElement(element, i, false))}
                    <Group
                        draggable
                        ref={groupRef}
                        onDragEnd={(e) => {
                            updateResetGroup();
                        }}
                    >
                        {groupSelection.map((id) => {
                            const idx = elements.findIndex((element) => element.id === id);
                            return idx !== -1
                                ? elementToReactElement(elements[idx], idx, true)
                                : null;
                        })}
                    </Group>
                </Layer>
                <Layer id="comment-layer">
                    {view === APP_VIEW.comment &&
                        comments.map((comment, i) => {
                            return (
                                <CommentElement
                                    draggable
                                    key={i}
                                    isSelected={selectedComment === comment.id}
                                    comment={comment}
                                    comments={comments}
                                    setComments={setComments}
                                    stageRef={stageRef}
                                    handleSelect={() => setSelectedComment(comment.id)}
                                    editComment={editComment}
                                />
                            );
                        })}
                </Layer>
            </Stage>
        </div>
    );
}

interface ExitCommentStateProps {
    view: APP_VIEW;
    setView: (view: APP_VIEW) => void;
}

const ExitCommentView: React.FC<ExitCommentStateProps> = ({ view, setView }) => {
    const displayStyle = view === APP_VIEW.comment ? {} : { display: "none" };

    return (
        <ExitCommentViewButton style={displayStyle} onClick={() => setView(APP_VIEW.select)}>
            <typography.LargeText>Exit Comment Mode</typography.LargeText>
        </ExitCommentViewButton>
    );
};
