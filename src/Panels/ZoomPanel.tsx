import styled from "styled-components";
import { SquareButton } from "../components/Components";
import { CenterBar } from "../styles/containers";
import { ReactComponent as FitToScreenIcon } from "../assets/fit-to-screen.svg";
import { ReactComponent as MinusIcon } from "../assets/minus.svg";
import { ReactComponent as PlusIcon } from "../assets/plus.svg";
import { ReactComponent as FullscreenIcon } from "../assets/fullscreen.svg";

const ZoomPanelContainer = styled(CenterBar)`
    bottom: 0px;
    border-radius: 8px 8px 0px 0px;
`;

const StyledPercentage = styled.div`
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 20px;

    width: 55px;
    height: 55px;
    padding: 2px;

    display: flex;
    justify-content: center;
    align-items: center;

`;

const StyledMinusIcon = styled(MinusIcon)`
    transform: translateY(-4px);
`;

interface ZoomPanelProps {
    zoomLevel: number;
    zoomIn: () => void;
    zoomOut: () => void;
    zoomFit: () => void;
    toggleFullscreen: () => void;
}

export const ZoomPanel: React.FC<ZoomPanelProps> = ({
    zoomLevel,
    zoomIn,
    zoomOut,
    zoomFit,
    toggleFullscreen,
}) => {
    return (
        <ZoomPanelContainer>
            <SquareButton onClick={toggleFullscreen}>
                <FullscreenIcon />
            </SquareButton>
            <SquareButton onClick={zoomFit}>
                <FitToScreenIcon />
            </SquareButton>
            <SquareButton onClick={zoomOut}>
                <StyledMinusIcon />
            </SquareButton>
            <StyledPercentage>{zoomLevel}%</StyledPercentage>
            <SquareButton onClick={zoomIn}>
                <PlusIcon />
            </SquareButton>
        </ZoomPanelContainer>
    );
};
