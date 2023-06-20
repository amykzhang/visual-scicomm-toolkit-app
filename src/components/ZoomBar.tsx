import { useApp } from "@tldraw/tldraw";
import "@tldraw/tldraw/editor.css";
import { track } from "signia-react";
import styled from "styled-components";
import { SquareButton } from "./Components";
import { useEffect, useState } from "react";

/**
 * Given a zoom level, calculates the values needed to resize the editor
 * @param zoomLevel 1 to 10
 * @param ratio width/height ratio
 * @returns [width, height]
 */
export function calculateZoom(zoomLevel: number, ratio: number = 1.0458) {
    const pixelWidth = (vw: number) =>
        Math.round((document.documentElement.clientWidth * vw) / 100);
    const pxWidth = pixelWidth(30 + 7 * zoomLevel);
    const pxHeight = Math.round(pxWidth / ratio);

    return { width: pxWidth, height: pxHeight };
}

const ZoomBarContainer = styled.div`
    /* position: fixed; */
    /* left: 0px; */
    bottom: 0px;
    margin-left: auto;
    margin-right: auto;
    width: fit-content;
    display: flex;
    padding: 8px;
    gap: 8px;
    background-color: grey;
`;

export const ZoomBar = track(() => {
    const app = useApp();
    const zoom = app.camera.z;
    const zoompercent = Math.round(zoom * 100);

    function handleZoomIn() {
        app.zoomIn();
    }

    function handleZoomOut() {
        app.zoomOut();
    }

    function handleZoomFit() {
        app.setCamera(0, 0, 1);
    }

    function toggleFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen().catch((err) => {
                alert(
                    `Error attempting to enable fullscreen mode: ${err.message} (${err.name})`
                );
            });
        } else {
            document.body.requestFullscreen();
        }
    }

    return (
        <ZoomBarContainer>
            <SquareButton onClick={toggleFullscreen}></SquareButton>
            <SquareButton onClick={handleZoomFit}>Fit</SquareButton>
            <SquareButton onClick={handleZoomOut}>-</SquareButton>
            <SquareButton>{zoompercent}%</SquareButton>
            <SquareButton onClick={handleZoomIn}>+</SquareButton>
        </ZoomBarContainer>
    );
});
