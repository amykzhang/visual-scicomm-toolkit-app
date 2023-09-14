import { useEffect } from "react";
import styled from "styled-components";
import color from "../styles/color";

const StyledTextContainer = styled.div``;

const StyledTextButton = styled.button`
    background: ${color.white};
    border: 1px solid ${color.lightBlue};
    border-radius: 0px;
`;

export const TextTool = () => {

    return (
        <StyledTextContainer>
            <StyledTextButton>Text Box</StyledTextButton>
        </StyledTextContainer>
    );
};
