import { useState } from "react";
import { CommentProp, CommentStateProp } from "../utils/interfaces";
import { APP_VIEW } from "../utils/enums";
import color from "../styles/color";
import Konva from "konva";
import { v4 as uuid } from "uuid";

const defaultBackgroundColor = color.canvasBackground;
const commentBackgroundColor = color.commentBackground;

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
        setView(APP_VIEW.comment);
        setCommentViewState(() => {
            return {
                active: true,
                backgroundColor: commentBackgroundColor,
            };
        });
    }

    function exitCommentView() {
        setView(APP_VIEW.select);
        setCommentViewState(() => {
            return {
                active: false,
                backgroundColor: defaultBackgroundColor,
            };
        });
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
                y: y,
                width: 200,
                height: 80,
                text: "hello world",
                isEditing: false,
            },
        ]);
    }

    function removeComment(
        id: string,
        comments: CommentProp[],
        setComments: React.Dispatch<React.SetStateAction<CommentProp[]>>
    ) {
        setComments(comments.filter((comment) => comment.id !== id));
    }

    const handleAddComment = (
        comments: CommentProp[],
        setComments: React.Dispatch<React.SetStateAction<CommentProp[]>>,
        stageRef: React.RefObject<Konva.Stage>
    ) => {
        return (e: Konva.KonvaEventObject<MouseEvent>) => {
            // if clicked anywhere other than a comment
            if (stageRef.current !== null && e.target.getAttrs().type !== "comment") {
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
        addComment,
        removeComment,
    };
};
