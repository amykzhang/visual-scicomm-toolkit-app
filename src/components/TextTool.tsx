import { App, useApp } from "@tldraw/tldraw";
import "@tldraw/tldraw/editor.css";
import { useEffect } from "react";
import { track } from "signia-react";
import styled from "styled-components";

const StyledTextContainer = styled.div``;

const StyledTextButton = styled.button`
    background: white;
    border: 1px solid lightblue;
    border-radius: 0px;
`;

export const TextTool = track(() => {
    const app = useApp();

    useEffect(() => {
        app.setProp("font", "sans");
    }, []);

    return (
        <StyledTextContainer>
            <StyledTextButton
                data-isactive={app.currentToolId === "text"}
                onClick={() => app.setSelectedTool("text")}
            >
                Text Box
            </StyledTextButton>
        </StyledTextContainer>
    );
});
