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
