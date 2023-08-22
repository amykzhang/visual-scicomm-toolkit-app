import { APP_VIEW } from "./enums";

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

export interface CanvasStateProp {
    images: ImageProp[];
}

export interface CanvasStateStringsProp {
    images: string;
}

export interface AppStateProp {
    stagePosition: {
        x: number;
        y: number;
    };
    scaleX: number;
    view: APP_VIEW;
    isLeftPanelOpen: boolean;
    isRightPanelOpen: boolean;
}
