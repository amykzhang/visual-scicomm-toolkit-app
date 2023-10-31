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
import { v4 as uuid } from "uuid";

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

let wheeldelta = {
    x: 0,
    y: 0,
};
let wheeling: any;

export default function App() {
    const elementsLayerRef = useRef<Konva.Layer>(null);
    const exportAreaRef = useRef<Konva.Rect>(null);
    const selectionRectRef = useRef<Konva.Rect>(null);
    const transformerRef = useRef<Konva.Transformer>(null);
    const lineRef = useRef<Konva.Line>(null);

    const primaryMenuRef = useRef<HTMLDivElement | null>(null);
    const fillRef = useRef<HTMLDivElement>(null);
    const strokeRef = useRef<HTMLDivElement>(null);
    const colorPaletteRef = useRef<HTMLDivElement | null>(null);
    const styleRef = useRef<HTMLDivElement | null>(null);
    const styleMenuRef = useRef<HTMLDivElement | null>(null);

    const [shiftKey, setShiftKey] = useState(false);
    const [isWheeling, setIsWheeling] = useState(false);

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
    const { selectElement, deleteSelected } = SelectionManager(
        setElements,
        // view,
        // setView,
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
    const [secondaryMenuPosition, setSecondaryMenuPosition] = useState({ x: -1000, y: -1000 });
    const [primaryMenuItems, setPrimaryMenuItems] = useState<{
        stroke: boolean;
        fill: boolean;
        fontStyle: boolean;
        opacity: boolean;
        values: any;
    }>({
        stroke: true,
        fill: true,
        fontStyle: true,
        opacity: true,
        values: { opacity: 1 },
    });
    const [secondaryMenuItems, setSecondaryMenuItems] = useState<{
        copy: boolean;
        paste: boolean;
        delete: boolean;
        bringToFront: boolean;
        sendToBack: boolean;
    }>({
        copy: true,
        paste: true,
        delete: true,
        bringToFront: true,
        sendToBack: true,
    });
    const [contextPointer, setContextPointer] = useState({ x: 0, y: 0 });

    const [submenuOption, setSubmenuOption] = useState<"stroke" | "fill" | "style" | null>(null);
    const [colorSelected, setColorSelected] = useState<string | null>(null);
    const [styleSelected, setStyleSelected] = useState<string | null>(null);
    const [appliedStyles, setAppliedStyles] = useState({
        bold: false,
        italic: false,
        underline: false,
        strikethrough: false,
    });

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

    const [clipboard, setClipboard] = useState<ElementProp[]>([]);

    const copy = useCallback(() => {
        setClipboard(elements.filter((element) => groupSelection.includes(element.id)));
    }, [elements, groupSelection]);

    const paste = useCallback(
        (x?: number, y?: number) => {
            if (x === undefined || y === undefined) {
                const newElements = clipboard.map((element) => {
                    const newElement = { ...element };
                    newElement.id = uuid();
                    newElement.x += 10;
                    newElement.y += 10;
                    return newElement;
                });

                setElements([...elements, ...newElements]);
                setGroupSelection(newElements.map((element) => element.id));
            } else {
                const relX = Math.min(...clipboard.map((element) => element.x));
                const relY = Math.min(...clipboard.map((element) => element.y));

                const newElements = clipboard.map((element) => {
                    const newElement = { ...element };
                    newElement.id = uuid();
                    newElement.x = newElement.x - relX + x;
                    newElement.y = newElement.y - relY + y;
                    return newElement;
                });

                setElements([...elements, ...newElements]);
                setGroupSelection(newElements.map((element) => element.id));
            }
        },
        [elements, clipboard]
    );

    // -- KEY PRESSES --
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Shift") setShiftKey(true);
            if (e.metaKey && (e.key === "=" || e.key === "-" || e.key === "0")) {
                e.preventDefault();
                if (e.key === "=") zoomIn();
                if (e.key === "-") zoomOut();
                if (e.key === "0") zoomFit();
            }

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
                    case "c":
                        if (e.metaKey) copy();
                        break;
                    case "v":
                        if (e.metaKey) paste();
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
            copy,
            paste,
            zoomFit,
            zoomIn,
            zoomOut,
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
                    // handleDragStart={handleDragStart(image.id)}
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
                    // handleDragStart={handleDragStart(shape.id)}
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
                    // handleDragStart={handleDragStart(text.id)}
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
                    // handleDragStart={handleDragStart(line.id)}
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
                    setShowPrimaryMenu(false);
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

        if (view !== APP_VIEW.select) return;
        const isEmpty = e.target === stageRef.current || e.target === exportAreaRef.current;
        const isGroupSelection = groupSelection.includes(e.target.id());

        if (!isGroupSelection) selectElement(e.target.id());
        if (!isEmpty) {
            setSecondaryMenuItems({
                copy: true,
                paste: true,
                delete: true,
                bringToFront: true,
                sendToBack: true,
            });
        } else {
            setSecondaryMenuItems({
                copy: false,
                paste: true,
                delete: false,
                bringToFront: false,
                sendToBack: false,
            });
        }

        setShowSecondaryMenu(true);
        setSecondaryMenuPosition({ x: e.evt.clientX, y: e.evt.clientY });

        if (stageRef.current !== null) {
            const stage = stageRef.current;
            setContextPointer({
                x: (e.evt.clientX - stage.x()) / stage.scaleX(),
                y: (e.evt.clientY - stage.y()) / stage.scaleY(),
            });
        }
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

    // --- HISTORY ---

    const handleUndo = () => {
        setShowPrimaryMenu(false);
        if (historyStep > 0) {
            historyStep -= 1;
            setElements(history[historyStep].canvas.elements);
            setComments(history[historyStep].canvas.comments);
            setGroupSelection(history[historyStep].selection);
        }
    };

    const handleRedo = () => {
        setShowPrimaryMenu(false);
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

    // Group Selection
    useEffect(() => {
        setGroupSelection(elementsWithinBounds);
    }, [elementsWithinBounds]);

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
            document.body.style.backgroundColor = color.commentViewBackground;
        } else {
            stage.getContent().style.backgroundColor = color.canvasBackground;
            document.body.style.backgroundColor = color.canvasBackground;
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
    }, [groupSelection]);

    useEffect(() => {
        // Show primary menu if there is a selection
        if (groupSelection.length > 0 && !isWheeling && historyStep === history.length - 1) {
            setShowPrimaryMenu(true);
        } else {
            setShowPrimaryMenu(false);
            setShowSecondaryMenu(false);
        }
        setSubmenuOption(null);
    }, [groupSelection, isWheeling]);

    useEffect(() => {
        // Setting primary menu items
        const selectedElements = elements.filter((element) => groupSelection.includes(element.id));
        let someImage = false;
        let someShape = false;
        let someText = false;
        let someLine = false;
        selectedElements.forEach((element) => {
            if (element.type === "image") someImage = true;
            else if (element.type === "shape") someShape = true;
            else if (element.type === "text") someText = true;
            else if (element.type === "line") someLine = true;
        });

        const showStroke = (someShape || someLine) && !someImage && !someText;
        const showFill = (someShape || someText) && !someLine && !someImage;
        const showTextStyle = someText && !someShape && !someLine && !someImage;
        const showOpacity = someShape || someImage || someLine || someText;

        let stroke = {};
        let fill = {};
        let fontStyle = {};
        let opacity = {};
        if (showStroke) {
            const shapesAndLines = selectedElements as (ShapeProp | LineProp)[];
            const sameColor = shapesAndLines.every(
                (element) => element.stroke === shapesAndLines[0].stroke
            );
            stroke = { stroke: sameColor ? shapesAndLines[0].stroke : "#000000" };
        }
        if (showFill) {
            const shapes = selectedElements as ShapeProp[];
            const sameColor = shapes.every((element) => element.fill === shapes[0].fill);
            fill = { fill: sameColor ? shapes[0].fill : "#000000" };
        }
        if (showTextStyle) {
            const texts = selectedElements as TextProp[];
            const sameStyle =
                texts.every((element) => element.fontStyle === texts[0].fontStyle) &&
                texts.every((element) => element.textDecoration === texts[0].textDecoration);
            if (sameStyle) {
                setAppliedStyles({
                    bold: texts[0].fontStyle.includes("bold"),
                    italic: texts[0].fontStyle.includes("italic"),
                    underline: texts[0].textDecoration.includes("underline"),
                    strikethrough: texts[0].textDecoration.includes("line-through"),
                });
            } else {
                setAppliedStyles({
                    bold: false,
                    italic: false,
                    underline: false,
                    strikethrough: false,
                });
            }
        }
        if (showOpacity) {
            const elements = selectedElements as (ShapeProp | ImageProp | LineProp | TextProp)[];
            const sameOpacity = elements.every(
                (element) => element.opacity === elements[0].opacity
            );
            opacity = { opacity: sameOpacity ? elements[0].opacity : 1 };
        }

        setPrimaryMenuItems({
            stroke: showStroke,
            fill: showFill,
            fontStyle: showTextStyle,
            opacity: showOpacity,
            values: { ...stroke, ...fill, ...fontStyle, ...opacity },
        });
    }, [groupSelection, elements]);

    useEffect(() => {
        if (primaryMenuRef.current !== null && transformerRef.current !== null) {
            const transformer = transformerRef.current;
            const primaryMenu = primaryMenuRef.current;

            if (showPrimaryMenu) {
                const { width, height } = primaryMenu.getBoundingClientRect();

                let x =
                    transformer.x() +
                    transformer.width() / 2 -
                    primaryMenu.getBoundingClientRect().width / 2;
                let y = transformer.y() - 100;

                const [newX, newY] = fitInFrame(x, y, width, height, [10, 10]);

                primaryMenu.style.left = newX + "px";
                primaryMenu.style.top = newY + "px";
            } else {
                primaryMenu.style.left = "";
                primaryMenu.style.top = "";
            }
        }
    }, [groupSelection, showPrimaryMenu]);

    useEffect(() => {
        if (
            (submenuOption !== "fill" && submenuOption !== "stroke") ||
            primaryMenuRef.current === null ||
            colorPaletteRef.current === null
        )
            return;
        const menu = primaryMenuRef.current.getBoundingClientRect();
        const palette = colorPaletteRef.current.getBoundingClientRect();

        let buttonX = 0;
        let buttonW = 0;
        if (submenuOption === "fill" && fillRef.current !== null) {
            buttonX = fillRef.current.getBoundingClientRect().x;
            buttonW = fillRef.current.getBoundingClientRect().width;
        } else if (submenuOption === "stroke" && strokeRef.current !== null) {
            buttonX = strokeRef.current.getBoundingClientRect().x;
            buttonW = strokeRef.current.getBoundingClientRect().width;
        }
        let x = buttonX + buttonW / 2 - palette.width / 2;
        let y = menu.y - palette.height;
        const [newX, newY] = fitInFrame(x, y, palette.width, palette.height, [
            10,
            menu.height + 10,
        ]);

        colorPaletteRef.current.style.left = newX + "px";
        colorPaletteRef.current.style.top = newY + "px";
    }, [submenuOption]);

    useEffect(() => {
        if (
            submenuOption !== "style" ||
            primaryMenuRef.current === null ||
            styleMenuRef.current === null ||
            styleRef.current === null
        )
            return;

        const menu = primaryMenuRef.current.getBoundingClientRect();
        const container = styleMenuRef.current.getBoundingClientRect();

        const buttonX = styleRef.current.getBoundingClientRect().x;
        const buttonW = styleRef.current.getBoundingClientRect().width;

        let x = buttonX + buttonW / 2 - container.width / 2;
        let y = menu.y - container.height - 5;
        const [newX, newY] = fitInFrame(x, y, container.width, container.height, [
            10,
            menu.height + 10,
        ]);

        styleMenuRef.current.style.left = newX + "px";
        styleMenuRef.current.style.top = newY + "px";
    }, [submenuOption]);

    useEffect(() => {
        if (colorSelected === null) return;

        if (submenuOption === "fill") {
            groupSelection.forEach((id) => {
                handleChange(id, { fill: colorSelected });
            });
        }
        if (submenuOption === "stroke") {
            groupSelection.forEach((id) => {
                handleChange(id, { stroke: colorSelected });
            });
        }
        setColorSelected(null);
    }, [colorSelected, submenuOption, groupSelection]);

    useEffect(() => {
        if (styleSelected === null) return;

        setAppliedStyles((appliedStyles) => {
            let { bold, italic, underline, strikethrough } = appliedStyles;
            if (styleSelected === "bold") bold = !bold;
            if (styleSelected === "italic") italic = !italic;
            if (styleSelected === "underline") underline = !underline;
            if (styleSelected === "strikethrough") strikethrough = !strikethrough;

            const fontStyle: string[] = [];
            if (bold) fontStyle.push("bold");
            if (italic) fontStyle.push("italic");
            const textDecoration: string[] = [];
            if (underline) textDecoration.push("underline");
            if (strikethrough) textDecoration.push("line-through");

            groupSelection.forEach((id) => handleChange(id, { fontStyle, textDecoration }));

            return {
                bold,
                italic,
                underline,
                strikethrough,
            };
        });

        setStyleSelected(null);
    }, [styleSelected, groupSelection]);

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
                <Tooltip id="ui-tooltip" />
            </PanelsContainer>
            <Stage
                draggable={view === APP_VIEW.pan}
                width={window.innerWidth}
                height={window.innerHeight}
                onWheel={(e) => {
                    setIsWheeling(true);
                    handleWheel(e);

                    clearTimeout(wheeling);
                    wheeling = setTimeout(function () {
                        setIsWheeling(false);
                        wheeling = undefined;
                        // reset wheeldelta
                        wheeldelta.x = 0;
                        wheeldelta.y = 0;
                    }, 250);

                    wheeldelta.x += e.evt.deltaX;
                    wheeldelta.y += e.evt.deltaY;
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
                    {isDrawing && (
                        <Line
                            ref={lineRef}
                            {...constants.line}
                            stroke={color.black}
                            points={points}
                        />
                    )}
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
                <div>
                    {(submenuOption === "fill" || submenuOption === "stroke") && (
                        <ColorPaletteContainer ref={colorPaletteRef}>
                            {activity.color_palette.colors.map((color, i) => {
                                return (
                                    <ColorCircle
                                        key={i}
                                        onClick={() => setColorSelected(color)}
                                        style={{ backgroundColor: color }}
                                    />
                                );
                            })}
                            {activity.color_palette.color_picker && (
                                <PlusCircle
                                    onClick={(e) => {
                                        setColorSelected("Enter a color");
                                    }}
                                >
                                    +<ColorPicker type="color" />
                                </PlusCircle>
                            )}
                        </ColorPaletteContainer>
                    )}

                    {submenuOption === "style" && (
                        <StyleContainer ref={styleMenuRef}>
                            <Item
                                data-isactive={appliedStyles.bold}
                                onClick={() => setStyleSelected("bold")}
                            >
                                Bold
                            </Item>
                            <Item
                                data-isactive={appliedStyles.italic}
                                onClick={() => setStyleSelected("italic")}
                            >
                                Italic
                            </Item>
                            <Item
                                data-isactive={appliedStyles.underline}
                                onClick={() => setStyleSelected("underline")}
                            >
                                Underline
                            </Item>
                            <Item
                                data-isactive={appliedStyles.strikethrough}
                                onClick={() => setStyleSelected("strikethrough")}
                            >
                                Strikethrough
                            </Item>
                        </StyleContainer>
                    )}

                    <HorizontalMenu ref={primaryMenuRef}>
                        {primaryMenuItems.opacity && (
                            <Item>
                                Opacity:&nbsp;
                                <StyledSlider
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={primaryMenuItems.values.opacity}
                                    onChange={(e) => {
                                        const opacity = parseFloat(e.target.value);
                                        setPrimaryMenuItems({
                                            ...primaryMenuItems,
                                            values: { ...primaryMenuItems.values, opacity },
                                        });
                                        groupSelection.forEach((id) => {
                                            handleChange(id, { opacity });
                                        });
                                    }}
                                />
                            </Item>
                        )}
                        {(primaryMenuItems.fontStyle ||
                            primaryMenuItems.fill ||
                            primaryMenuItems.stroke) && <Separator />}
                        {primaryMenuItems.fontStyle && (
                            <Item
                                data-isactive={submenuOption === "style"}
                                ref={styleRef}
                                onClick={() =>
                                    setSubmenuOption(submenuOption !== "style" ? "style" : null)
                                }
                            >
                                <b>
                                    <u>
                                        <i>B</i>
                                    </u>
                                </b>
                            </Item>
                        )}
                        {primaryMenuItems.fill && (
                            <Item
                                data-isactive={submenuOption === "fill"}
                                ref={fillRef}
                                onClick={() => {
                                    setSubmenuOption(submenuOption !== "fill" ? "fill" : null);
                                }}
                            >
                                Fill
                            </Item>
                        )}
                        {primaryMenuItems.stroke && (
                            <Item
                                data-isactive={submenuOption === "stroke"}
                                ref={strokeRef}
                                onClick={() => {
                                    setSubmenuOption(submenuOption !== "stroke" ? "stroke" : null);
                                }}
                            >
                                Stroke
                            </Item>
                        )}
                    </HorizontalMenu>
                </div>
            )}
            {showSecondaryMenu && (
                <VerticalMenu
                    style={{
                        top: secondaryMenuPosition.y,
                        left: secondaryMenuPosition.x,
                    }}
                >
                    {secondaryMenuItems.copy && (
                        <Item
                            onClick={() => {
                                copy();
                                setShowSecondaryMenu(false);
                            }}
                        >
                            Copy
                        </Item>
                    )}
                    {secondaryMenuItems.paste && (
                        <Item
                            onClick={() => {
                                paste(contextPointer.x, contextPointer.y);
                                setShowSecondaryMenu(false);
                            }}
                        >
                            Paste
                        </Item>
                    )}
                    {secondaryMenuItems.delete && (
                        <Item
                            onClick={() => {
                                deleteSelected();
                                setShowSecondaryMenu(false);
                            }}
                        >
                            Delete
                        </Item>
                    )}
                    {secondaryMenuItems.bringToFront && <Separator />}
                    {secondaryMenuItems.bringToFront && (
                        <Item
                            onClick={() => {
                                bringToFront(groupSelection);
                                setShowSecondaryMenu(false);
                            }}
                        >
                            Bring to Front
                        </Item>
                    )}
                    {secondaryMenuItems.sendToBack && (
                        <Item
                            onClick={() => {
                                sendToBack(groupSelection);
                                setShowSecondaryMenu(false);
                            }}
                        >
                            Send to Back
                        </Item>
                    )}
                </VerticalMenu>
            )}
        </div>
    );
}

const HorizontalMenu = styled.div`
    user-select: none;
    display: flex;
    flex-direction: row;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 5px;
    background: ${color.white};
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
    padding: 5px;
    gap: 5px;
`;

const VerticalMenu = styled.div`
    user-select: none;
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 5px;
    background: ${color.white};
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
    padding: 5px;
    gap: 5px;
`;

const Item = styled.div`
    cursor: pointer;
    padding: 4px 10px;
    display: flex;
    align-items: center;
    border-radius: 5px;
    border: 1px solid transparent;

    &:hover {
        border: 1px solid ${color.grey};
    }

    &[data-isactive="true"] {
        background: ${color.lightBlue};
        transition: all 0.3s ease-in-out;
    }
`;

const Separator = styled.span`
    border: 1px solid ${color.grey};
    border-radius: 5px;
    margin: 5px;
`;

const StyledSlider = styled.input`
    cursor: pointer;
    width: 100%;
    height: 100%;
    color: ${color.black};
    background-color: ${color.white};
`;

const StyleContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: row;
    border-radius: 5px;
    background: ${color.white};
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
    padding: 5px;
    gap: 5px;
`;

const ColorPaletteContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 150px;
    padding: 10px;
    gap: 5px;
    background: ${color.white};
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
`;

const ColorCircle = styled.div`
    cursor: pointer;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid ${color.lightGrey};

    &:hover {
        transition: all 0.2s ease-in-out;
        border: 1px solid ${color.grey};
    }
`;

const PlusCircle = styled.div`
    position: relative;
    cursor: pointer;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 0.1px solid ${color.grey};
    background-color: ${color.white};
    text-align: center;
    line-height: 35px;
    font-size: 40px;
    color: ${color.grey};
`;

const ColorPicker = styled.input`
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    border-radius: 50%;
    width: 100%;
    height: 100%;
    opacity: 0;
`;

function fitInFrame(
    x: number,
    y: number,
    width: number,
    height: number,
    padding: [number, number]
): [number, number] {
    const margin = 70;
    // Check if menu is out of bounds
    if (x < padding[0]) x = padding[0];
    if (x + width > window.innerWidth - padding[0]) x = window.innerWidth - width - padding[0];
    if (y < margin + padding[1]) y = margin + padding[1];
    if (y > window.innerHeight - height - margin - padding[1])
        y = window.innerHeight - height - margin - padding[1];

    return [x, y];
}
