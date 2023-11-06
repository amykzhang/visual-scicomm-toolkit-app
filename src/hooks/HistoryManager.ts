import { useEffect } from "react";
import { CommentProp, ElementProp } from "../utils/interfaces";

interface HistoryProp {
    elements: ElementProp[];
    selection: string[];
}

let history: HistoryProp[] = [
    {
        elements: [],
        selection: [],
    },
];

let historyStep = 0;
const maxHistoryStackSize = 100;

export const HistoryManager = (
    elements: ElementProp[],
    setElements: React.Dispatch<React.SetStateAction<ElementProp[]>>,
    groupSelection: string[],
    setGroupSelection: React.Dispatch<React.SetStateAction<string[]>>,
    initialCanvasState: { elements: ElementProp[]; comments: CommentProp[] }
) => {
    const handleUndo = () => {
        if (historyStep > 0) {
            historyStep -= 1;
            setElements(history[historyStep].elements);
            setGroupSelection(history[historyStep].selection);
        }
    };

    const handleRedo = () => {
        if (historyStep < history.length - 1) {
            historyStep += 1;
            setElements(history[historyStep].elements);
            setGroupSelection(history[historyStep].selection);
        }
    };

    // Save history
    useEffect(() => {
        // Save only last  actions
        if (history.length > maxHistoryStackSize) {
            history = history.slice(1);
            historyStep -= 1;
        }

        const newState = {
            elements,
            selection: groupSelection,
        };

        if (JSON.stringify(newState) !== JSON.stringify(history[historyStep])) {
            history = [...history.slice(0, historyStep + 1), newState];
            historyStep += 1;
        }
    }, [elements, groupSelection]);

    // Set previously saved state on initial load
    useEffect(() => {
        history = [
            {
                elements: initialCanvasState.elements,
                selection: [],
            },
        ];
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
