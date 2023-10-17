import styled from "styled-components";
import color from "../styles/color";

const StyledTextContainer = styled.div`
    padding: 2px;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;

    &:hover,
    &[data-isactive="true"] {
        background: ${color.lightBlue};
    }
`;

const StyledTextButton = styled.button`
    background: transparent;
    border: 1.8px solid ${color.lightBlue};
    cursor: pointer;
`;

interface TextToolProps {
    isTextMode: boolean;
    toggleTextMode: () => void;
}

export const TextTool = ({ isTextMode, toggleTextMode }: TextToolProps) => {
    return (
        <StyledTextContainer data-isactive={isTextMode}>
            <StyledTextButton onClick={toggleTextMode}>Text Box</StyledTextButton>
        </StyledTextContainer>
    );
};
