import { useApp } from "@tldraw/tldraw";
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
        const handleKeyUp = (e: KeyboardEvent) => {
            switch (e.key) {
                case "Delete":
                case "Backspace": {
                    app.deleteShapes();
                }
            }
        };

        window.addEventListener("keyup", handleKeyUp);
        return () => {
            window.removeEventListener("keyup", handleKeyUp);
        };
    });

    return (
        <StyledTextContainer>
            <StyledTextButton
                data-isactive={app.currentToolId === "text"}
                onClick={() =>
                    app.setSelectedTool("text", { "data-font": "sans" })
                }
            >
                Text Box
            </StyledTextButton>
        </StyledTextContainer>
    );
});
