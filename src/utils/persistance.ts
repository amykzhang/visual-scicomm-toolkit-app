import { APP_VIEW } from "./enums";
import {
    ElementProp,
    UiStateProp,
    StageStateProp,
    CanvasStateProp,
    CommentProp,
} from "./interfaces";

const LOCALSTORAGE_CANVAS_STATE_KEY = "visual-toolkit-canvas";
const LOCALSTORAGE_UI_STATE_KEY = "visual-toolkit-ui";
const LOCALSTORAGE_STAGE_STATE_KEY = "visual-toolkit-stage";

// Saves each canvas layer/group as string, then stringify canvasState and save to local storage
function persistCanvasState(elements: ElementProp[], comments: CommentProp[]) {
    window.localStorage.setItem(
        LOCALSTORAGE_CANVAS_STATE_KEY,
        JSON.stringify({
            elements: elements,
            comments: comments,
        })
    );
}

// Returns reconstructed canvas state from local storage
function retrieveCanvasState(): CanvasStateProp {
    const saved = window.localStorage.getItem(LOCALSTORAGE_CANVAS_STATE_KEY);
    if (saved !== null) {
        console.log("Found saved canvas state");
        const canvasState = JSON.parse(saved);
        return canvasState;
    }
    console.log("No saved canvas state found");
    return { elements: [], comments: [] };
}

// save UI state to local storage
function persistUiState(state: UiStateProp) {
    window.localStorage.setItem(LOCALSTORAGE_UI_STATE_KEY, JSON.stringify(state));
}

function retrieveUiState(): UiStateProp {
    const saved = window.localStorage.getItem(LOCALSTORAGE_UI_STATE_KEY);
    if (saved !== null) {
        console.log("Found saved UI state");
        const persistedUiState = JSON.parse(saved);
        return persistedUiState;
    }
    console.log("No saved UI state found");
    return {
        isLeftPanelOpen: true,
        isRightPanelOpen: true,
        view: APP_VIEW.select,
    };
}

function persistStageState(state: StageStateProp) {
    window.localStorage.setItem(LOCALSTORAGE_STAGE_STATE_KEY, JSON.stringify(state));
}

function retrieveStageState(): StageStateProp | null {
    const saved = window.localStorage.getItem(LOCALSTORAGE_STAGE_STATE_KEY);
    if (saved !== null) {
        console.log("Found saved stage state");
        const persistedStageState = JSON.parse(saved);
        return persistedStageState;
    }
    console.log("No saved stage state found");
    return null;
}

export const persistance = {
    persistCanvasState,
    retrieveCanvasState,
    persistUiState,
    retrieveUiState,
    persistStageState,
    retrieveStageState,
};
