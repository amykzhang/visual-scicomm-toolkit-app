import { useApp } from "@tldraw/tldraw";
import "@tldraw/tldraw/editor.css";
import { useEffect } from "react";
import { track } from "signia-react";
import { SquareButton } from "./Components";
import styled from "styled-components";

const ToolBarContainer = styled.div`
    margin-left: auto;
    margin-right: auto;
    width: fit-content;
    display: flex;
    padding: 8px;
    gap: 8px;
    background-color: grey;
`;

export const ToolBar = track(() => {
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
        <ToolBarContainer>
            <SquareButton
                data-isactive={app.currentToolId === "select"}
                onClick={() => app.setSelectedTool("select")}
            >
                Select
            </SquareButton>
            <SquareButton
                data-isactive={app.currentToolId === "hand"}
                onClick={() => app.setSelectedTool("hand")}
            >
                Pan
            </SquareButton>
            <SquareButton
            /* WIP - Comment tool
                     data-isactive={app.currentToolId === 'comment'}
                      onClick={() => app.setSelectedTool('comment')} 

                      Create a comment view
                    */
            >
                Comment
            </SquareButton>
            <SquareButton onClick={() => app.undo()}>Undo</SquareButton>
            <SquareButton onClick={() => app.redo()}>Redo</SquareButton>
        </ToolBarContainer>
    );
});
