import { useEffect } from "react";
import { CommentProp, ElementProp } from "../utils/interfaces";
import { APP_VIEW } from "../utils/enums";

let history: {
    elements: ElementProp[];
    selection: string[];
}[] = [
    {
        elements: [],
        selection: [],
    },
];

let commentHistory: CommentProp[][] = [[]];

let historyStep = 0;
let commentStep = 0;
const maxHistoryStackSize = 100;

export const HistoryManager = (
    view: APP_VIEW,
    elements: ElementProp[],
    setElements: React.Dispatch<React.SetStateAction<ElementProp[]>>,
    comments: CommentProp[],
    setComments: React.Dispatch<React.SetStateAction<CommentProp[]>>,
    groupSelection: string[],
    setGroupSelection: React.Dispatch<React.SetStateAction<string[]>>,

    initialCanvasState: { elements: ElementProp[]; comments: CommentProp[] }
) => {
    const handleUndo = () => {
        if (view === APP_VIEW.comment) {
            if (commentStep > 0) {
                commentStep -= 1;
                setComments(commentHistory[commentStep]);
            }
        } else {
            if (historyStep > 0) {
                historyStep -= 1;
                setElements(history[historyStep].elements);
                setGroupSelection(history[historyStep].selection);
            }
        }
    };

    const handleRedo = () => {
        if (view === APP_VIEW.comment) {
            if (commentStep < commentHistory.length - 1) {
                commentStep += 1;
                setComments(commentHistory[commentStep]);
            }
        } else {
            if (historyStep < history.length - 1) {
                historyStep += 1;
                setElements(history[historyStep].elements);
                setGroupSelection(history[historyStep].selection);
            }
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

    useEffect(() => {
        if (commentHistory.length > maxHistoryStackSize) {
            commentHistory = commentHistory.slice(1);
            commentStep -= 1;
        }

        const newState = comments;

        if (JSON.stringify(newState) !== JSON.stringify(commentHistory[commentStep])) {
            commentHistory = [...commentHistory.slice(0, commentStep + 1), newState];
            commentStep += 1;
        }
    }, [comments]);

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
