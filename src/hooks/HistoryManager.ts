import { useEffect } from "react";
import { CanvasStateProp, CommentProp, ElementProp } from "../utils/interfaces";

interface HistoryProp {
    canvas: CanvasStateProp;
    selection: string[];
}

let history: HistoryProp[] = [
    {
        canvas: { elements: [], comments: [] },
        selection: [],
    },
];

let historyStep = 0;
const historyLimit = 100;

export const HistoryManager = (
    elements: ElementProp[],
    setElements: React.Dispatch<React.SetStateAction<ElementProp[]>>,
    comments: CommentProp[],
    setComments: React.Dispatch<React.SetStateAction<CommentProp[]>>,
    groupSelection: string[],
    setGroupSelection: React.Dispatch<React.SetStateAction<string[]>>,
    initialCanvasState: { elements: ElementProp[]; comments: CommentProp[] }
) => {
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

    // Save history
    useEffect(() => {
        // Save only last  actions
        if (history.length > historyLimit) {
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

    // Set previously saved state on initial load
    useEffect(() => {
        history = [{ canvas: initialCanvasState, selection: [] }];
        historyStep = 0;
        // eslint-disable-next-line
    }, []);
    return {
        history,
        historyStep,
        handleUndo,
        handleRedo,
    };
};
