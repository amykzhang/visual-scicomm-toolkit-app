import { FC } from "react";
import Konva from "konva";
import styled from "styled-components";
import { ImageProp } from "../utils/interfaces";
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
    images: ImageProp[];
    setImages: React.Dispatch<React.SetStateAction<ImageProp[]>>;
    stageRef: React.MutableRefObject<Konva.Stage | null>;
}

export const ImageTool: FC<ImageToolProps> = ({
    src,
    name,
    dimensions,
    images,
    setImages,
    stageRef,
}) => {
    function putImageOnCanvas(
        x: number,
        y: number,
        offset: { x: number; y: number }
    ) {
        const imageElement = new Image();
        imageElement.width = dimensions.width;
        imageElement.height = dimensions.height;
        imageElement.src = src;

        setImages([
            ...images,
            {
                id: uuid(),
                x: x,
                y: y,
                width: dimensions.width,
                height: dimensions.height,
                rotation: 0,
                isDragging: false,
                image: imageElement,
                src: src,
                offset: offset,
            },
        ]);
    }

    const handleImageDragEnd = (e: React.DragEvent) => {
        e.preventDefault();
        if (stageRef.current !== null) {
            const stage = stageRef.current;
            const x = (e.clientX - stage.x()) / stage.scaleX();
            const y = (e.clientY - stage.y()) / stage.scaleX();
            putImageOnCanvas(x, y, {
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
