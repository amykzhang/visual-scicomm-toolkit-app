import React, { Fragment } from "react";
import { Text } from "react-konva";
import { CommentProp } from "../utils/interfaces";
import { handleDragEnd, handleDragStart } from "../functions";

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
    return (
        <Fragment>
            <Text
                {...comment}
                onDragStart={handleDragStart(comments, setComments)}
                onDragEnd={handleDragEnd(comments, setComments)}
                draggable={true}
                onClick={() => console.log("clicked")}
            />
        </Fragment>
    );
};

export default CommentElement;
