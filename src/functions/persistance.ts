import {
    ImageProp,
    CanvasStateStringsProp,
    UiStateProp,
    StageStateProp,
    CanvasStateProp,
} from "../utils/interfaces";

const LOCALSTORAGE_CANVAS_STATE_KEY = "visual-toolkit-canvas";
const LOCALSTORAGE_UI_STATE_KEY = "visual-toolkit-ui";
const LOCALSTORAGE_STAGE_STATE_KEY = "visual-toolkit-stage";

function reconstructImagesFromJSON(imagesJSON: string): ImageProp[] {
    const images = JSON.parse(imagesJSON);
    const reconstructedImages: ImageProp[] = images.map((image: ImageProp) => {
        const imageElement = new window.Image();
        imageElement.width = image.width;
        imageElement.height = image.height;
        imageElement.src = image.src;
        return {
            ...image,
            image: imageElement,
        };
    });
    return reconstructedImages;
}

// Saves each canvas layer/group as string, then stringify canvasState and save to local storage
function persistCanvasState(images: ImageProp[]) {
    window.localStorage.setItem(
        LOCALSTORAGE_CANVAS_STATE_KEY,
        JSON.stringify({
            images: JSON.stringify(images),
        })
    );
}

// Returns reconstructed canvas state from local storage
function retrieveCanvasState(): CanvasStateProp | undefined {
    const canvasStateJSON = window.localStorage.getItem(
        LOCALSTORAGE_CANVAS_STATE_KEY
    );

    if (canvasStateJSON !== null) {
        const canvasStateStringFields: CanvasStateStringsProp =
            JSON.parse(canvasStateJSON);

        const persistedCanvasState = {
            images: reconstructImagesFromJSON(canvasStateStringFields.images),
        };

        return persistedCanvasState;
    }
}

// save UI state to local storage
function persistUiState(state: UiStateProp) {
    window.localStorage.setItem(
        LOCALSTORAGE_UI_STATE_KEY,
        JSON.stringify(state)
    );
}

function retrieveUiState(): UiStateProp | undefined {
    const saved = window.localStorage.getItem(LOCALSTORAGE_UI_STATE_KEY);
    if (saved !== null) {
        const persistedUiState = JSON.parse(saved);
        return persistedUiState;
    }
}

function persistStageState(state: StageStateProp) {
    window.localStorage.setItem(
        LOCALSTORAGE_STAGE_STATE_KEY,
        JSON.stringify(state)
    );
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
