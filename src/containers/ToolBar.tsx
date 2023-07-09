import { useApp } from "@tldraw/tldraw";
import "@tldraw/tldraw/editor.css";
import { useEffect, useState } from "react";
import { track } from "signia-react";
import { SquareButton } from "../components/Components";
import styled from "styled-components";
import { CenterBar } from "../styles/containers";
import { ReactComponent as SelectIcon } from "../assets/select.svg";
import { ReactComponent as PanIcon } from "../assets/pan.svg";
import { ReactComponent as UndoIcon } from "../assets/undo.svg";
import { ReactComponent as RedoIcon } from "../assets/redo.svg";
import commentview from "../functions/CommentView";
import { CommentTool } from "../components/CommentTool";

const ToolBarContainer = styled(CenterBar)`
    top: 0;
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
                <SelectIcon />
            </SquareButton>
            <SquareButton
                data-isactive={app.currentToolId === "hand"}
                onClick={() => app.setSelectedTool("hand")}
            >
                <PanIcon />
            </SquareButton>
            <CommentTool />
            <SquareButton onClick={() => app.undo()}>
                <UndoIcon />
            </SquareButton>
            <SquareButton onClick={() => app.redo()}>
                <RedoIcon />
            </SquareButton>
        </ToolBarContainer>
    );
});
