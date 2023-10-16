import Konva from "konva";
import { APP_VIEW } from "./enums";

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

export type ElementProp = ImageProp | ShapeProp | TextProp | LineProp;

interface BaseProp {
    id: string;
    type: "image" | "shape" | "text" | "line";
    x: number;
    y: number;
    width: number;
    height: number;
    scaleX: number;
    scaleY: number;
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
}

export interface TextProp extends BaseProp {
    text: string;
    fontSize: number;
    fontFamily: string;
    fontStyle: string;
    fill: string;
    align: "left" | "center" | "right";
}

export interface LineProp extends BaseProp {
    points: number[];
    tension: number;
    stroke: string;
    strokeWidth: number;
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

export type editTextProp = (
    text: TextProp,
    handleChange: (id: string, attributes: any) => void,
    textRef: React.RefObject<Konva.Text>,
    transformerRef: React.RefObject<Konva.Transformer>
) => void;

export type editCommentProp = (
    textRef: React.RefObject<Konva.Text | null>,
    rectRef: React.RefObject<Konva.Rect | null>,
    transformerRef: React.RefObject<Konva.Transformer | null>,
    comment: CommentProp
) => void;
