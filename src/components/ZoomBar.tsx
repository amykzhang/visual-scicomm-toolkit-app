import { useApp } from "@tldraw/tldraw";
import "@tldraw/tldraw/editor.css";
import { track } from "signia-react";
import styled from "styled-components";
import { SquareButton } from "./Components";
import { useEffect } from "react";

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

interface ZoomBarProps {
    zoom: number;
    setZoom: (zoom: number) => void;
}

export const ZoomBar: React.FC<ZoomBarProps> = track(({ zoom, setZoom }) => {
    const app = useApp();
    app.canMoveCamera = false;

    const scaleZoom = (zoom: number, base: number = 30, increments = 7) => {
        return (base + increments * zoom) / 100;
    };

    useEffect(() => {
        app.setCamera(0, 0, scaleZoom(zoom));
    }, [app, zoom]);

    function handleZoomIn() {
        if (zoom < 10) {
            const newZoom = zoom + 1;
            setZoom(newZoom);
            app.setCamera(0, 0, scaleZoom(newZoom));
        }
    }

    function handleZoomOut() {
        if (zoom > 1) {
            const newZoom = zoom - 1;
            setZoom(newZoom);
            app.setCamera(0, 0, scaleZoom(newZoom));
        }
    }

    function handleZoomFit() {
        setZoom(2);
        app.setCamera(0, 0, scaleZoom(2));
    }

    function handleZoomFullscreen() {
        setZoom(10);
        app.setCamera(0, 0, scaleZoom(10));
    }

    return (
        <ZoomBarContainer>
            <SquareButton onClick={handleZoomFullscreen}>
                Fullscreen
            </SquareButton>
            <SquareButton onClick={handleZoomFit}>Fit</SquareButton>
            <SquareButton onClick={handleZoomOut}>-</SquareButton>
            <SquareButton>{zoom * 10}%</SquareButton>
            <SquareButton onClick={handleZoomIn}>+</SquareButton>
        </ZoomBarContainer>
    );
});
