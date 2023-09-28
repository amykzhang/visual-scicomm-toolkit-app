import { APP_VIEW } from "./enums";

export interface CommentStateProp {
    active: boolean;
    backgroundColor: string;
}

export interface CanvasStateProp {
    elements: ElementProp[];
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

export type ElementProp = ImageProp | ShapeProp;

interface BaseProp {
    id: string;
    type: "image" | "shape";
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
}

export interface ImageProp extends BaseProp {
    src: string;
}

export interface ShapeProp extends BaseProp {
    fill: string;
    stroke: string;
    strokeWidth: number;
    shape: string;
    scaleX: number;
    scaleY: number;
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

export interface SelectionBoundsProp {
    x: number;
    y: number;
    width: number;
    height: number;
}
