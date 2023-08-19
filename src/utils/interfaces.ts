import { STAGE_VIEW } from "./enums";

export interface CommentStateProp {
    active: boolean;
    backgroundColor: string;
}

export interface CommentViewProp {
    state: CommentStateProp;
    setState: React.Dispatch<React.SetStateAction<CommentStateProp>>;
    enter: () => void;
    exit: () => void;
}

export interface ImageProp {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    isDragging: boolean;
    image: HTMLImageElement | undefined;
    src: string;
    offset?: {
        x: number;
        y: number;
    };
}

export interface canvasStateProp {
    images: string;
    stagePosition: { x: number; y: number };
    zoomLevel: number;
    uiState: uiStateProp;
}

export interface uiStateProp {
    view: STAGE_VIEW;
    isLeftPanelOpen: boolean;
    isRightPanelOpen: boolean;
}
