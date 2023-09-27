import { APP_VIEW } from "./enums";

export interface CommentStateProp {
    active: boolean;
    backgroundColor: string;
}

export interface CanvasStateProp {
    images: ImageProp[];
    shapes: ShapeProp[];
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
    scale: number;
    text: string;
}

export interface ShapeProp {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    fill: string;
    stroke: string;
    strokeWidth: number;
    type: string;
}

export interface SelectionBoundsProp {
    x: number;
    y: number;
    width: number;
    height: number;
}
