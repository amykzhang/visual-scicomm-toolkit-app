import React, { Fragment } from "react";
import { Text } from "react-konva";
import { CommentProp } from "../utils/interfaces";
import Konva from "konva";

interface CommentElementProp {
    comment: CommentProp;
    comments: CommentProp[];
    setComments: React.Dispatch<React.SetStateAction<CommentProp[]>>;
    draggable: boolean;
}

const CommentElement = ({
    comment,
    comments,
    setComments,
    draggable,
}: CommentElementProp) => {
    const handleCommentDragStart = (e: Konva.KonvaEventObject<DragEvent>) => {
        setComments(comments.map((comment) => {
            return { ...comment, isDragging: comment.id === e.target.id() };
        }));
    };

    const handleCommentDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
        setComments(comments.map((comment) => {
            if (comment.isDragging) {
                return {
                    ...comment,
                    x: e.target.x(),
                    y: e.target.y(),
                    isDragging: false,
                };
            } else {
                return comment;
            }
        }));
    };

    return (
        <Fragment>
            <Text
                {...comment}
                onDragStart={handleCommentDragStart}
                onDragEnd={handleCommentDragEnd}
                draggable={true}
                onClick={() => console.log("clicked")}
            />
        </Fragment>
    );
};

export default CommentElement;
