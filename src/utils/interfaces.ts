import { APP_VIEW } from "./enums";

export interface CommentStateProp {
    active: boolean;
    backgroundColor: string;
}

export interface ExportOptions {
    exportPNG: () => void;
    exportJPEG: () => void;
    exportPDF: () => void;
}

export interface CanvasStateProp {
    images: ImageProp[];
    comments: CommentProp[];
}

export interface UiStateProp {
    view: APP_VIEW;
    isLeftPanelOpen: boolean;
    isRightPanelOpen: boolean;
}

export interface StageStateProp {
    stagePosition: { x: number; y: number };
    scaleX: number;
}

// Elements

export interface ImageProp {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    image: HTMLImageElement | undefined;
    src: string;
}

export interface CommentProp {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    text: string;
}

export interface SelectionBoundsProp {
    x: number;
    y: number;
    width: number;
    height: number;
}
