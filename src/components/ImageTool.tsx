import React, { FC } from "react";
import { useApp } from "@tldraw/tldraw";
import styled from "styled-components";
import { track } from "signia-react";

interface IImageTool {
    src: string;
    name: string;
}

const StyledImage = styled.img`
    /* width: 40px;
    height: 40px; */
`;

export const ImageTool: FC<IImageTool> = track(({ src, name }) => {
    const app = useApp();

    const handleImageClick = () => {
        const imageShape = {
            type: "image",
            src: src,
            // x: canvasState.cursor.x,
            // y: canvasState.cursor.y,
            width: 100, // Set your desired width
            height: 100, // Set your desired height
        };
    };

    return <StyledImage src={src} title={name} />;
});
