import { FC } from "react";
import Konva from "konva";
import styled from "styled-components";
import { ElementProp, ShapeProp } from "../utils/interfaces";
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
    elements: ElementProp[];
    setElements: React.Dispatch<React.SetStateAction<ElementProp[]>>;
    stageRef: React.MutableRefObject<Konva.Stage | null>;
}

export const RectangleTool: FC<RectangleToolProps> = ({ src, elements, setElements, stageRef }) => {
    function addShape(x: number, y: number, type: string) {
        setElements([
            ...elements,
            {
                id: uuid(),
                type: "shape",
                x: x,
                y: y,
                width: 50,
                height: 50,
                rotation: 0,
                fill: color.darkGrey,
                stroke: "",
                strokeWidth: 2,
                shape: type,
            } as ShapeProp,
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

    return <StyledImage src={src} width={30} height={30} onDragEnd={handleImageDragEnd} />;
};
