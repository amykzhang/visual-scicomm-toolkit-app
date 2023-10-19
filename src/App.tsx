import React, { useCallback, useEffect, useRef, useState } from "react";
import Konva from "konva";
import { Stage, Layer, Line, Transformer, Rect } from "react-konva";
import activity_visual_strategies from "./activity/activity";
import { PanelsContainer, BottomZone, TopZone } from "./styles/containers";
import {
    ExportManager,
    SelectionManager,
    StageViewManager,
    TextViewManager,
    CommentViewManager,
    DragSelectManager,
    DrawViewManager,
} from "./hooks";
import {
    TitlePanel,
    ToolbarPanel,
    ActivityPanel,
    ZoomPanel,
    ElementsPanel,
    ExportPanel,
} from "./Panels";
import { APP_VIEW } from "./utils/enums";
import { ExportArea } from "./components/ExportArea";
import { ExitCommentViewButton } from "./components/Components";
import {
    CanvasStateProp,
    CommentProp,
    ElementProp,
    ImageProp,
    LineProp,
    ShapeProp,
    TextProp,
    UiStateProp,
} from "./utils/interfaces";
import { persistance } from "./utils/persistance";
import { ImageElement, CommentElement, ShapeElement, TextElement, LineElement } from "./Elements";
import color from "./styles/color";
import typography from "./styles/typography";
import constants from "./utils/constants";
import { Tooltip } from "react-tooltip";
import styled from "styled-components";

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
    const elementsLayerRef = useRef<Konva.Layer>(null);
    const exportAreaRef = useRef<Konva.Rect>(null);
    const selectionRectRef = useRef<Konva.Rect>(null);
    const transformerRef = useRef<Konva.Transformer>(null);
    const lineRef = useRef<Konva.Line>(null);
    const primaryMenuRef = useRef<HTMLDivElement>(null);

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

    // Stage View
    const { stageRef, handleWheel, zoomLevel, zoomIn, zoomOut, zoomFit, toggleFullscreen } =
        StageViewManager(activity.canvas_size);

    // --- CANVAS STATE ---

    const [elements, setElements] = useState<ElementProp[]>(history[0].canvas.elements);
    const [comments, setComments] = useState<CommentProp[]>(history[0].canvas.comments);

    // Group Selection
    const [groupSelection, setGroupSelection] = useState<string[]>(history[0].selection);

    // --- MANAGERS FOR VIEWS ---

    // Selection
    const { selectElement, handleDragStart, deleteSelected } = SelectionManager(
        setElements,
        view,
        setView,
        shiftKey,
        groupSelection,
        setGroupSelection
    );

    const {
        selectedComment,
        setSelectedComment,
        handleCommentViewClickOff,
        editComment,
        isEditingComment,
    } = CommentViewManager(setComments, stageRef);

    const { toggleTextMode, handleTextClick, editText, isEditingText, justCreated } =
        TextViewManager(view, setView, setElements, stageRef, setGroupSelection);

    const {
        isSelectionMode,
        selectionBounds,
        elementsWithinBounds,
        handleDragSelectMouseDown,
        handleDragSelectMouseMove,
        handleDragSelectMouseUp,
    } = DragSelectManager(stageRef, elements);

    const {
        points,
        isDrawing,
        handleDrawMouseDown,
        handleDrawMouseMove,
        handleDrawMouseUp,
        toggleDrawMode,
    } = DrawViewManager(view, setView, setElements, stageRef);

    // --- CONTEXT MENU ---
    const [showPrimaryMenu, setShowPrimaryMenu] = useState(false);
    const [showSecondaryMenu, setShowSecondaryMenu] = useState(false);
    const [primaryMenuPosition, setPrimaryMenuPosition] = useState({ x: -1000, y: -1000 });
    const [secondaryMenuPosition, setSecondaryMenuPosition] = useState({ x: -1000, y: -1000 });
    const [primaryMenuItems, setPrimaryMenuItems] = useState({
        stroke: true,
        fill: true,
        textStyle: true,
        opacity: true,
    });

    function bringForward(id: string) {
        const index = elements.findIndex((element) => element.id === id);
        if (index !== -1 && index !== elements.length - 1) {
            setElements((elements) => {
                [elements[index], elements[index + 1]] = [elements[index + 1], elements[index]];
                return elements;
            });
        }
    }

    const bringToFront = useCallback(
        (ids?: string[]) => {
            if (ids === undefined) {
                ids = groupSelection;
            }
            const indices = ids.map((id) => elements.findIndex((element) => element.id === id));
            if (indices.includes(-1)) return;
            setElements((elements) => {
                const elementsToMove = indices.map((index) => elements[index]);
                elements = elements.filter((element) => !elementsToMove.includes(element));
                elements.push(...elementsToMove);
                return elements;
            });
        },
        [elements, groupSelection]
    );

    function sendBackward(id: string) {
        const index = elements.findIndex((element) => element.id === id);
        if (index !== -1 && index !== 0) {
            setElements((elements) => {
                [elements[index], elements[index - 1]] = [elements[index - 1], elements[index]];
                return elements;
            });
        }
    }

    const sendToBack = useCallback(
        (ids?: string[]) => {
            if (ids === undefined) {
                ids = groupSelection;
            }
            const indices = ids.map((id) => elements.findIndex((element) => element.id === id));
            if (indices.includes(-1)) return;
            setElements((elements) => {
                const elementsToMove = indices.map((index) => elements[index]);
                elements = elements.filter((element) => !elementsToMove.includes(element));
                elements.unshift(...elementsToMove);
                return elements;
            });
        },
        [elements, groupSelection]
    );

    // -- KEY PRESSES --
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Shift") setShiftKey(true);

            // SELECT VIEW
            if (view === APP_VIEW.select) {
                if (isEditingText) {
                    return;
                }
                switch (e.key) {
                    case "a":
                        if (e.metaKey) {
                            setGroupSelection(elements.map((element) => element.id));
                        }
                        break;
                    case "Escape":
                        setGroupSelection([]);
                        break;
                    case "Delete":
                    case "Backspace":
                        deleteSelected();
                        break;
                    case "z":
                        if (e.shiftKey && e.metaKey) handleRedo();
                        else if (e.metaKey) handleUndo();
                        break;
                    case "[":
                        sendToBack();
                        break;
                    case "]":
                        bringToFront();
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
                    default:
                        break;
                }
                // TEXT VIEW
            } else if (view === APP_VIEW.text) {
                switch (e.key) {
                    case "Escape":
                        setView(APP_VIEW.select);
                        break;
                    case "z":
                        if (e.shiftKey && e.metaKey) handleRedo();
                        else if (e.metaKey) handleUndo();
                        break;
                    default:
                        break;
                }
            } else if (view === APP_VIEW.draw) {
                switch (e.key) {
                    case "Escape":
                        setView(APP_VIEW.select);
                        break;
                    case "z":
                        if (e.shiftKey && e.metaKey) handleRedo();
                        else if (e.metaKey) handleUndo();
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
            bringToFront,
            sendToBack,
        ]
    );

    const handleKeyUp = useCallback((e: KeyboardEvent) => {
        if (e.key === "Shift") setShiftKey(false);
    }, []);

    // Given an id and attributes, update the element with the given id with the given attributes
    const handleChange = (id: string, attributes: any) =>
        setElements((elements) =>
            elements.map((element) => (element.id === id ? { ...element, ...attributes } : element))
        );

    // Given an elementProp, return the appropriate element
    function elementToReactElement(element: ElementProp): React.ReactElement {
        const draggable = view === APP_VIEW.select;
        if (element.type === "image") {
            const image = element as ImageProp;
            return (
                <ImageElement
                    key={image.id}
                    image={image}
                    draggable={draggable}
                    handleDragStart={handleDragStart(image.id)}
                    handleChange={handleChange}
                />
            );
        } else if (element.type === "shape") {
            const shape = element as ShapeProp;
            return (
                <ShapeElement
                    key={shape.id}
                    shape={shape}
                    draggable={draggable}
                    handleDragStart={handleDragStart(shape.id)}
                    handleChange={handleChange}
                />
            );
        } else if (element.type === "text") {
            const text = element as TextProp;
            return (
                <TextElement
                    key={text.id}
                    text={text}
                    draggable={draggable}
                    isJustCreated={justCreated === text.id}
                    isSelected={groupSelection.length === 1 && groupSelection.includes(text.id)}
                    handleDragStart={handleDragStart(text.id)}
                    handleChange={handleChange}
                    editText={editText}
                    transformerRef={transformerRef}
                />
            );
        } else if (element.type === "line") {
            const line = element as LineProp;
            return (
                <LineElement
                    key={line.id}
                    line={line}
                    draggable={draggable}
                    handleDragStart={handleDragStart(line.id)}
                    handleChange={handleChange}
                />
            );
        } else return <></>;
    }

    // Handle click off stage for all views
    function handleStageClick(e: Konva.KonvaEventObject<MouseEvent>) {
        if (e.evt.button !== 0) return; // Only handle left click

        if (stageRef.current === null || exportAreaRef.current === null) return;

        switch (view) {
            case APP_VIEW.select:
                if (e.target === stageRef.current || e.target === exportAreaRef.current) {
                    setGroupSelection([]);
                } else {
                    selectElement(e.target.id());
                }
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

    const handleContextMenu = (e: Konva.KonvaEventObject<MouseEvent>) => {
        e.evt.preventDefault();
        e.evt.stopPropagation();

        if (e.target === stageRef.current || e.target === exportAreaRef.current) return;

        setShowSecondaryMenu(true);
        setSecondaryMenuPosition({ x: e.evt.clientX, y: e.evt.clientY });
    };

    const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (view === APP_VIEW.select) {
            if (stageRef.current === null) return;
            const stage = stageRef.current;

            // Only start bounding box drag select if user clicks on stage or export area
            if (e.target === stage || e.target === exportAreaRef.current) {
                handleDragSelectMouseDown(e);
            }

            setShowSecondaryMenu(false);
        } else if (view === APP_VIEW.draw) {
            handleDrawMouseDown(e);
        }
    };

    const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (view === APP_VIEW.select && isSelectionMode) {
            handleDragSelectMouseMove(e);
        } else if (view === APP_VIEW.draw) {
            handleDrawMouseMove(e);
        }
    };

    const handleMouseUp = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (view === APP_VIEW.select) {
            if (isSelectionMode) handleDragSelectMouseUp(e);
        }
        if (view === APP_VIEW.draw) {
            handleDrawMouseUp(e);
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
    const { isExporting, startExportProcess } = ExportManager(activity, stageRef);

    // Save canvas state
    useEffect(() => {
        persistance.persistCanvasState(elements, comments);
    }, [elements, comments]);

    // Save UI state
    useEffect(() => {
        persistance.persistUiState(uiState);
    }, [uiState]);

    // Save history
    useEffect(() => {
        // Save only last  actions
        if (history.length > 200) {
            history = history.slice(1);
            historyStep -= 1;
        }

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

    // Backdoor set line cap (Konva Bug, can't set linecap with string)
    useEffect(() => {
        lineRef.current?.lineCap("round");
        // eslint-disable-next-line
    }, [lineRef.current]);

    // Updates transformer nodes everytime there is a new selection
    useEffect(() => {
        if (transformerRef.current !== null && elementsLayerRef.current !== null) {
            const transformer = transformerRef.current;
            const layer = elementsLayerRef.current;
            const selected = layer.getChildren().filter((node) => {
                return groupSelection.includes(node.id());
            });
            transformer.nodes(selected);
            layer.batchDraw();
        }

        if (groupSelection.length > 0) {
            setShowPrimaryMenu(true);
        } else setShowPrimaryMenu(false);
    }, [groupSelection]);

    useEffect(() => {
        if (showPrimaryMenu) {
            if (transformerRef.current !== null && primaryMenuRef.current !== null) {
                const transformer = transformerRef.current;
                const primaryMenu = primaryMenuRef.current;

                const x =
                    transformer.x() +
                    transformer.width() / 2 -
                    primaryMenu.getBoundingClientRect().width / 2;
                const y = transformer.y() - 100;

                console.log(x, y);

                setPrimaryMenuPosition({
                    x: x,
                    y: y,
                });
            }
        } else setPrimaryMenuPosition({ x: -1000, y: -1000 });
    }, [groupSelection, showPrimaryMenu]);

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
                    view={view}
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
                    toggleDrawMode={toggleDrawMode}
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
                <Tooltip
                    id="ui-tooltip"
                    style={{
                        borderRadius: "2px",
                        fontSize: "12px",
                        padding: "6px 10px",
                    }}
                />
            </PanelsContainer>
            <Stage
                draggable={view === APP_VIEW.pan}
                width={window.innerWidth}
                height={window.innerHeight}
                onWheel={(e) => {
                    handleWheel(e);
                    setShowPrimaryMenu(false);
                    setShowSecondaryMenu(false);
                }}
                // handle unfocus/click on stage
                onClick={handleStageClick}
                onContextMenu={handleContextMenu}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                ref={stageRef}
            >
                <Layer>
                    <ExportArea exportAreaRef={exportAreaRef} {...activity.canvas_size} />
                    <Rect // Selection Rectangle Bounding Box
                        visible={isSelectionMode && view === APP_VIEW.select}
                        ref={selectionRectRef}
                        x={selectionBounds.x}
                        y={selectionBounds.y}
                        width={selectionBounds.width}
                        height={selectionBounds.height}
                        fill={color.lightBlue}
                        stroke={color.blue}
                        strokeWidth={2}
                        opacity={0.25}
                    />
                    {isDrawing && <Line ref={lineRef} {...constants.line} points={points} />}
                </Layer>
                <Layer ref={elementsLayerRef} id="elements-layer">
                    {elements.map((element, index) => elementToReactElement(element))}
                    <Transformer
                        ref={transformerRef}
                        visible={!isExporting}
                        // shouldOverdrawWholeArea
                        borderStroke={constants.transformer.borderStroke}
                        keepRatio={false}
                        rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315]}
                        boundBoxFunc={(oldBox, newBox) => {
                            // limit resize
                            if (newBox.width < 5 || newBox.height < 5) {
                                return oldBox;
                            }
                            return newBox;
                        }}
                        onDragStart={() => setShowPrimaryMenu(false)}
                        onDragEnd={() => setShowPrimaryMenu(true)}
                        onTransformStart={() => setShowPrimaryMenu(false)}
                        onTransformEnd={() => setShowPrimaryMenu(true)}
                    />
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

            {showPrimaryMenu && (
                <Menu1
                    ref={primaryMenuRef}
                    style={{
                        top: primaryMenuPosition.y,
                        left: primaryMenuPosition.x,
                    }}
                >
                    <Item>Opacity</Item>
                    <Item>Fill</Item>
                    <Item>Stroke</Item>
                    <Separator />
                    <Item>Text Style</Item>
                </Menu1>
            )}
            {showSecondaryMenu && (
                <Menu2
                    style={{
                        top: secondaryMenuPosition.y,
                        left: secondaryMenuPosition.x,
                    }}
                >
                    <Item>Copy</Item>
                    <Item>Paste</Item>
                    <Item>Delete</Item>
                    <Separator />
                    <Item>Bring Forward</Item>
                    <Item>Send Backward</Item>
                    <Item>Bring to Front</Item>
                    <Item>Send to Back</Item>
                </Menu2>
            )}
        </div>
    );
}

const Menu1 = styled.div`
    user-select: none;
    z-index: 400;
    display: flex;
    flex-direction: row;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 5px;
    background-color: ${color.white};
    padding: 5px;
    gap: 5px;
`;

const Menu2 = styled.div`
    user-select: none;
    z-index: 401;
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 5px;
    background-color: ${color.white};
    padding: 5px;
    gap: 5px;
`;

const Item = styled.div`
    background-color: green;
    padding: 4px 10px;
`;

const Separator = styled.div`
    border: 1px solid #000000;
    border-radius: 5px;
    margin: 5px;
`;

const Submenu = styled.div`
    background-color: red;
`;
