import styled from "styled-components";
import color from "../styles/color";
import { ReactComponent as Doodle } from "../assets/doodle.svg";

const StyledTextContainer = styled.div``;

const StyledTextButton = styled.button`
    border: none;
    border-radius: 5px;

    &[data-isactive="true"] {
        background: ${color.lightBlue};
    }
`;

interface TextToolProps {
    isDrawMode: boolean;
    toggleDrawMode: () => void;
}

export const DrawTool = ({ isDrawMode, toggleDrawMode }: TextToolProps) => {
    return (
        <StyledTextContainer>
            <StyledTextButton data-isactive={isDrawMode} onClick={toggleDrawMode}>
                <Doodle />
            </StyledTextButton>
        </StyledTextContainer>
    );
};
