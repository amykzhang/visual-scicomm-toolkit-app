import { useState } from "react";
import { CommentStateProp } from "../utils/interfaces";
import { STAGE_VIEW } from "../utils/enums";

const initial_comment_view: CommentStateProp = {
    active: false,
    backgroundColor: "white",
};

interface CommentViewManagerProp {
    setView: React.Dispatch<React.SetStateAction<STAGE_VIEW>>;
}

export const CommentViewManager = (
    setView: React.Dispatch<React.SetStateAction<STAGE_VIEW>>
) => {
    const [state, setState] = useState<CommentStateProp>(initial_comment_view);

    function enter() {
        setView(STAGE_VIEW.comment);
        setState((prev) => {
            return {
                ...prev,
                active: true,
            };
        });
    }

    function exit() {
        setView(STAGE_VIEW.select);
        setState((prev) => {
            return {
                ...prev,
                active: false,
            };
        });
    }

    return {
        state,
        setState,
        enter,
        exit,
    };
};
