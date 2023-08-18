import { FC } from "react";
import Konva from "konva";
import styled from "styled-components";
import { ImageProp } from "../utils/interfaces";
import { v4 as uuid } from "uuid";
import useImage from "use-image";

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
    size: { width: number; height: number };
    images: ImageProp[];
    setImages: React.Dispatch<React.SetStateAction<ImageProp[]>>;
    stageRef: React.MutableRefObject<Konva.Stage | null>;
}

export const ImageTool: FC<ImageToolProps> = ({
    src,
    name,
    size,
    images,
    setImages,
    stageRef,
}) => {
    console.log(size);
    const dimensions = size;
    const [image] = useImage(src);

    function putImageOnCanvas(x: number, y: number) {
        console.log(src, dimensions.width, dimensions.height);
        if (image !== undefined) {
            image.width = dimensions.width;
            image.height = dimensions.height;

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
                    image: image,
                },
            ]);
        }
    }
    const handleImageClick = () => {
        console.log("handleImageClick", dimensions.width, dimensions.height);
    };

    const handleImageDragStart = (e: React.DragEvent) => {
        console.log("handleImageDragStart");
    };

    const handleImageDragEnd = (e: React.DragEvent) => {
        e.preventDefault();
        console.log("handleImageDragEnd");
        if (stageRef.current !== null) {
            const stage = stageRef.current;
            const x =
                (e.clientX - stage.x()) / stage.scaleX() - dimensions.width / 2;
            const y =
                (e.clientY - stage.y()) / stage.scaleX() -
                dimensions.height / 2;
            putImageOnCanvas(x, y);
        }
    };

    return (
        <StyledImage
            src={src}
            title={name}
            width={dimensions.width}
            height={dimensions.height}
            onClick={handleImageClick}
            onDragStart={handleImageDragStart}
            onDragEnd={handleImageDragEnd}
        />
    );
};
