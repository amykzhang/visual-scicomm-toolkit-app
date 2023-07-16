import { FC, useEffect, useState } from "react";
import styled from "styled-components";

interface IImageTool {
    src: string;
    name: string;
}

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

export const ImageTool: FC<IImageTool> = ({ src, name }) => {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const handleImageLoad = (e: any) => {
        setDimensions({ width: e.target.width, height: e.target.height });
    };

    const handleImageClick = () => {
        console.log("handleImageClick", dimensions.width, dimensions.height);
    };

    const handleImageDragStart = () => {
        console.log("handleImageDrag");
    };

    const handleImageDragEnd = () => {
        console.log("handleImageDragEnd");

        const imageShape = {
            type: "image",
            src: src,
            // x: app.userPresence?.cursor.x,
            // y: app.userPresence?.cursor.y,
            width: dimensions.width,
            height: dimensions.height,
        };
        console.log(imageShape);

        // app.createShapes([{ id: "box1", type: "box" }], true);
    };

    // function makeImageShape(x, y, w, h, src) {}

    return (
        <StyledImage
            src={src}
            title={name}
            onLoad={handleImageLoad}
            onClick={handleImageClick}
            onDragStart={handleImageDragStart}
            onDragEnd={handleImageDragEnd}
        />
    );
};
