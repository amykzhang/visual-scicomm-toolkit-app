import Konva from "konva";
import { CommentProp } from "../utils/interfaces";
import { v4 as uuid } from "uuid";

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
            text: "hello world",
            isDragging: false,
            isEditing: false,
        },
    ]);
}

export const handleAddComment = (
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
