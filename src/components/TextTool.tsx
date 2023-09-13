import { useEffect } from "react";
import styled from "styled-components";

const StyledTextContainer = styled.div``;

const StyledTextButton = styled.button`
    background: white;
    border: 1px solid lightblue;
    border-radius: 0px;
`;

export const TextTool = () => {
    useEffect(() => {
        // app.setProp("font", "sans");
    }, []);

    return (
        <StyledTextContainer>
            <StyledTextButton>Text Box</StyledTextButton>
        </StyledTextContainer>
    );
};
