import styled from "styled-components";
import color from "../styles/color";

const StyledTextContainer = styled.div``;

const StyledTextButton = styled.button`
    background: ${color.white};
    border: 1px solid ${color.lightBlue};

    &[data-isactive="true"] {
        background: ${color.lightBlue};
        border: 1px solid ${color.blue};
    }
`;

interface TextToolProps {
    isTextMode: boolean;
    toggleTextMode: () => void;
}

export const TextTool = ({ isTextMode, toggleTextMode }: TextToolProps) => {
    return (
        <StyledTextContainer>
            <StyledTextButton data-isactive={isTextMode} onClick={toggleTextMode}>
                Text Box
            </StyledTextButton>
        </StyledTextContainer>
    );
};
