import { useState } from "react";
import { CommentStateProp } from "../utils/interfaces";
import { APP_VIEW } from "../utils/enums";

const initial_comment_view: CommentStateProp = {
    active: false,
    backgroundColor: "white",
};

export const CommentViewManager = (setView: (view: APP_VIEW) => void) => {
    const [state, setState] = useState<CommentStateProp>(initial_comment_view);

    function enter() {
        setView(APP_VIEW.comment);
        setState((prev) => {
            return {
                ...prev,
                active: true,
            };
        });
    }

    function exit() {
        setView(APP_VIEW.select);
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
