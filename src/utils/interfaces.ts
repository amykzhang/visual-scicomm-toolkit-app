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
}
