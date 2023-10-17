import styled from "styled-components";
import color from "../styles/color";
import { ReactComponent as Doodle } from "../assets/doodle.svg";
import constants from "../utils/constants";

const StyledDrawContainer = styled.div``;

const StyledDrawButton = styled.button`
    border: none;
    border-radius: 5px;

    &:hover {
        background: ${color.lightBlue};
    }

    &[data-isactive="true"] {
        background: ${color.lightBlue};
    }
`;

interface DrawToolProps {
    isDrawMode: boolean;
    toggleDrawMode: () => void;
}

export const DrawTool = ({ isDrawMode, toggleDrawMode }: DrawToolProps) => {
    return (
        <StyledDrawContainer>
            <StyledDrawButton
                data-isactive={isDrawMode}
                onClick={toggleDrawMode}
                {...constants.tooltip}
                data-tooltip-content="Freehand draw"
            >
                <Doodle />
            </StyledDrawButton>
        </StyledDrawContainer>
    );
};
