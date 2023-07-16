import styled from "styled-components";
import { SquareButton } from "../components/Components";
import { CenterBar } from "../styles/containers";
import { ReactComponent as FitToScreenIcon } from "../assets/fit-to-screen.svg";
import { ReactComponent as MinusIcon } from "../assets/minus.svg";
import { ReactComponent as PlusIcon } from "../assets/plus.svg";
import { ReactComponent as FullscreenIcon } from "../assets/fullscreen.svg";

const ZoomBarContainer = styled(CenterBar)`
    bottom: 0px;
`;

const StyledPercentage = styled.p`
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 20px;
`;

const StyledMinusIcon = styled(MinusIcon)`
    transform: translateY(-4px);
`;

export const ZoomBar = () => {
    // const zoom = app.camera.z;
    // const zoompercent = Math.round(zoom * 100);

    function handleZoomIn() {
        // app.zoomIn();
    }

    function handleZoomOut() {
        // app.zoomOut();
    }

    function handleZoomFit() {
        // app.setCamera(0, 0, 1);
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
            <SquareButton onClick={toggleFullscreen}>
                <FullscreenIcon />
            </SquareButton>
            <SquareButton onClick={handleZoomFit}>
                <FitToScreenIcon />
            </SquareButton>
            <SquareButton onClick={handleZoomOut}>
                <StyledMinusIcon />
            </SquareButton>
            <SquareButton>
                <StyledPercentage>000%</StyledPercentage>
            </SquareButton>
            <SquareButton onClick={handleZoomIn}>
                <PlusIcon />
            </SquareButton>
        </ZoomBarContainer>
    );
};
