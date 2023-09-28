import { FC, ReactElement } from "react";
import Konva from "konva";
import styled, { IStyledComponent } from "styled-components";
import { ElementProp, ShapeProp } from "../utils/interfaces";
import { v4 as uuid } from "uuid";
import color from "../styles/color";

const StyledBase = styled.div`
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

const RectangleFilled = styled(StyledBase)`
    width: 30px;
    height: 30px;
    background: ${color.shapeGrey};
`;

const RectangleOutline = styled(StyledBase)`
    width: 30px;
    height: 30px;
    border: 2px solid ${color.shapeGrey};
`;

const CircleFilled = styled(StyledBase)`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: ${color.shapeGrey};
`;

const CircleOutline = styled(StyledBase)`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 2px solid ${color.shapeGrey};
`;

const TriangleFilled = styled(StyledBase)`
    width: 0;
    height: 0;
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
    border-bottom: 30px solid ${color.shapeGrey};
`;

// pure css outlined triangle
const TriangleOutline = styled(StyledBase)`
    width: 0;
    height: 0;
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
    border-bottom: 30px solid ${color.shapeGrey};

    &:after {
        content: "";
        position: relative;
        left: -12px;
        top: -16px;
        width: 0;
        height: 0;
        border-left: 12px solid transparent;
        border-right: 12px solid transparent;
        border-bottom: 24px solid ${color.white};
    }
`;

interface ShapeToolProps {
    shape: string;
    fill: boolean;
    elements: ElementProp[];
    setElements: React.Dispatch<React.SetStateAction<ElementProp[]>>;
    stageRef: React.MutableRefObject<Konva.Stage | null>;
}

export const ShapeTool: FC<ShapeToolProps> = ({ shape, fill, elements, setElements, stageRef }) => {
    let StyledShape;

    switch (shape) {
        case "rectangle":
            StyledShape = fill ? RectangleFilled : RectangleOutline;
            break;
        case "circle":
            StyledShape = fill ? CircleFilled : CircleOutline;
            break;
        case "triangle":
            StyledShape = fill ? TriangleFilled : TriangleOutline;
            break;
        default:
            StyledShape = RectangleFilled;
    }

    function addShape(x: number, y: number, type: string) {
        console.log(x, y, type);
        setElements([
            ...elements,
            {
                id: uuid(),
                type: "shape",
                x: x,
                y: y,
                width: 50,
                height: 50,
                scaleX: 1,
                scaleY: 1,
                rotation: 0,
                fill: fill ? color.shapeGrey : "transparent",
                stroke: fill ? "transparent" : color.shapeGrey,
                strokeWidth: fill ? 0 : 2,
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
            addShape(x, y, shape);
        }
    };

    return <StyledShape draggable onDragEnd={handleImageDragEnd} />;
};
