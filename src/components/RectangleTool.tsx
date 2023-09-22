import { FC } from "react";
import Konva from "konva";
import styled from "styled-components";
import { ShapeProp } from "../utils/interfaces";
import { v4 as uuid } from "uuid";
import color from "../styles/color";

const StyledImage = styled.img`
    cursor: move; /* fallback if grab cursor is unsupported */
    cursor: grab;
    cursor: -moz-grab;
    cursor: -webkit-grab;

    &:active {
        cursor: grabbing;
        cursor: -moz-grabbing;
        cursor: -webkit-grabbing;
    }
`;

interface RectangleToolProps {
    src: string;
    shapes: ShapeProp[];
    setShapes: React.Dispatch<React.SetStateAction<ShapeProp[]>>;
    stageRef: React.MutableRefObject<Konva.Stage | null>;
}

export const RectangleTool: FC<RectangleToolProps> = ({ src, shapes, setShapes, stageRef }) => {
    function addShape(x: number, y: number, type: string) {
        setShapes([
            ...shapes,
            {
                id: uuid(),
                x: x,
                y: y,
                width: 50,
                height: 50,
                rotation: 0,
                type: type,
                fill: color.darkGrey,
                stroke: "",
                strokeWidth: 2,
            },
        ]);
    }

    const handleImageDragEnd = (e: React.DragEvent) => {
        e.preventDefault();
        if (stageRef.current !== null) {
            const stage = stageRef.current;
            const x = (e.clientX - stage.x()) / stage.scaleX();
            const y = (e.clientY - stage.y()) / stage.scaleX();
            addShape(x, y, "rect");
        }
    };

    return <StyledImage src={src} width={50} height={50} onDragEnd={handleImageDragEnd} />;
};
