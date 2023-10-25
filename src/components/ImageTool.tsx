import { FC } from "react";
import Konva from "konva";
import styled from "styled-components";
import { ElementProp, ImageProp } from "../utils/interfaces";
import { v4 as uuid } from "uuid";

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

interface ImageToolProps {
    src: string;
    name: string;
    dimensions: { width: number; height: number };
    elements: ElementProp[];
    setElements: React.Dispatch<React.SetStateAction<ElementProp[]>>;
    stageRef: React.MutableRefObject<Konva.Stage | null>;
}

export const ImageTool: FC<ImageToolProps> = ({
    src,
    name,
    dimensions,
    elements,
    setElements,
    stageRef,
}) => {
    function addImage(x: number, y: number, offset: { x: number; y: number }) {
        setElements([
            ...elements,
            {
                id: uuid(),
                type: "image",
                x: x - offset.x,
                y: y - offset.y,
                width: dimensions.width,
                height: dimensions.height,
                src: src,
                scaleX: 1,
                scaleY: 1,
                rotation: 0,
                opacity: 1,
            } as ImageProp,
        ]);
    }

    const handleImageDragEnd = (e: React.DragEvent) => {
        e.preventDefault();
        if (stageRef.current !== null) {
            const stage = stageRef.current;
            const x = (e.clientX - stage.x()) / stage.scaleX();
            const y = (e.clientY - stage.y()) / stage.scaleX();
            addImage(x, y, {
                x: dimensions.width / 2,
                y: dimensions.height / 2,
            });
        }
    };

    return (
        <StyledImage
            src={src}
            title={name}
            width={dimensions.width}
            height={dimensions.height}
            onDragEnd={handleImageDragEnd}
        />
    );
};
