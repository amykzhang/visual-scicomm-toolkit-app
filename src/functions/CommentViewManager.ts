import { useState } from "react";
import { CommentStateProp } from "../utils/interfaces";
import { APP_VIEW } from "../utils/enums";
import color from "../styles/color";

const defaultBackgroundColor = color.canvasBackground;
const commentBackgroundColor = color.commentBackground;

export const CommentViewManager = (setView: (view: APP_VIEW) => void) => {
    const [state, setState] = useState<CommentStateProp>({
        active: false,
        backgroundColor: defaultBackgroundColor,
    });

    function enter() {
        setView(APP_VIEW.comment);
        setState(() => {
            return {
                active: true,
                backgroundColor: commentBackgroundColor,
            };
        });
    }

    function exit() {
        setView(APP_VIEW.select);
        setState(() => {
            return {
                active: false,
                backgroundColor: defaultBackgroundColor,
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
