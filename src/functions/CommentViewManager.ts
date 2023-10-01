import { useState } from "react";
import { CommentProp, CommentStateProp } from "../utils/interfaces";
import { APP_VIEW } from "../utils/enums";
import color from "../styles/color";
import Konva from "konva";
import { v4 as uuid } from "uuid";

const defaultBackgroundColor = color.canvasBackground;
const commentBackgroundColor = color.commentBackground;

const initialCommentProps = {
    width: 200,
    height: 55,
    scale: 1,
    text: "",
};

export const CommentViewManager = (
    setView: (view: APP_VIEW) => void,
    comments: CommentProp[],
    setComments: React.Dispatch<React.SetStateAction<CommentProp[]>>,
    stageRef: React.RefObject<Konva.Stage>
) => {
    const [commentViewState, setCommentViewState] = useState<CommentStateProp>({
        active: false,
        backgroundColor: defaultBackgroundColor,
    });
    const [selectedComment, setSelectedComment] = useState<string | null>(null);

    function enterCommentView() {
        setView(APP_VIEW.select);
        setCommentViewState(() => {
            return {
                active: true,
                backgroundColor: commentBackgroundColor,
            };
        });

        document.body.style.cursor = "crosshair";
    }

    function exitCommentView() {
        setView(APP_VIEW.select);
        setCommentViewState(() => {
            return {
                active: false,
                backgroundColor: defaultBackgroundColor,
            };
        });

        document.body.style.cursor = "default";
    }

    function addComment(
        x: number,
        y: number,
        comments: CommentProp[],
        setComments: React.Dispatch<React.SetStateAction<CommentProp[]>>
    ) {
        const id = uuid();
        setComments([
            ...comments,
            {
                id: id,
                x: x,
                y: y - initialCommentProps.height,
                ...initialCommentProps,
            },
        ]);
    }

    const handleAddComment = (
        comments: CommentProp[],
        setComments: React.Dispatch<React.SetStateAction<CommentProp[]>>,
        stageRef: React.RefObject<Konva.Stage>
    ) => {
        return (e: Konva.KonvaEventObject<MouseEvent>) => {
            if (stageRef.current !== null) {
                const stage = stageRef.current;
                const x = (e.evt.clientX - stage.x()) / stage.scaleX();
                const y = (e.evt.clientY - stage.y()) / stage.scaleX();
                addComment(x, y, comments, setComments);
            }
        };
    };

    // when not clicking on a comment, deselect selected comment or if nothing is selected add new comment
    function handleCommentViewClickOff(e: Konva.KonvaEventObject<MouseEvent>) {
        if (e.target.getAttrs().type !== "comment") {
            if (selectedComment !== null) setSelectedComment(null);
            else handleAddComment(comments, setComments, stageRef)(e);
        }
    }

    return {
        commentViewState,
        setCommentViewState,
        selectedComment,
        setSelectedComment,
        enterCommentView,
        exitCommentView,
        handleCommentViewClickOff,
    };
};
