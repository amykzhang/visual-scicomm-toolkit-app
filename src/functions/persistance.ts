import {
    ElementProp,
    UiStateProp,
    StageStateProp,
    CanvasStateProp,
    CommentProp,
} from "../utils/interfaces";

const LOCALSTORAGE_CANVAS_STATE_KEY = "visual-toolkit-canvas";
const LOCALSTORAGE_UI_STATE_KEY = "visual-toolkit-ui";
const LOCALSTORAGE_STAGE_STATE_KEY = "visual-toolkit-stage";

// function reconstructElementsFromJSON(elementsJSON: string): ElementProp[] {
//     const elements = JSON.parse(elementsJSON);
//     const reconstructedImages: ImageProp[] = elements.map((elements) => {
//             ...image,
//             image: imageElement,
//         };
//     });
//     return reconstructedImages;
// }

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
function retrieveCanvasState(): CanvasStateProp | undefined {
    const saved = window.localStorage.getItem(LOCALSTORAGE_CANVAS_STATE_KEY);

    if (saved !== null) {
        const canvasState = JSON.parse(saved);

        return canvasState;
    }
}

// save UI state to local storage
function persistUiState(state: UiStateProp) {
    window.localStorage.setItem(LOCALSTORAGE_UI_STATE_KEY, JSON.stringify(state));
}

function retrieveUiState(): UiStateProp | undefined {
    const saved = window.localStorage.getItem(LOCALSTORAGE_UI_STATE_KEY);
    if (saved !== null) {
        const persistedUiState = JSON.parse(saved);
        return persistedUiState;
    }
}

function persistStageState(state: StageStateProp) {
    window.localStorage.setItem(LOCALSTORAGE_STAGE_STATE_KEY, JSON.stringify(state));
}

function retrieveStageState(): StageStateProp | undefined {
    const saved = window.localStorage.getItem(LOCALSTORAGE_STAGE_STATE_KEY);
    if (saved !== null) {
        const persistedStageState = JSON.parse(saved);
        return persistedStageState;
    }
}

export const persistance = {
    persistCanvasState,
    retrieveCanvasState,
    persistUiState,
    retrieveUiState,
    persistStageState,
    retrieveStageState,
};
