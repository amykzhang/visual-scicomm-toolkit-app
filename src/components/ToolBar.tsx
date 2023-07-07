import { useApp } from "@tldraw/tldraw";
import "@tldraw/tldraw/editor.css";
import { useEffect, useState } from "react";
import { track } from "signia-react";
import { SquareButton } from "./Components";
import styled from "styled-components";
import { CenterBar } from "../styles/containers";
import { ReactComponent as SelectIcon } from "../assets/select.svg";
import { ReactComponent as CommentIcon } from "../assets/comment.svg";
import { ReactComponent as PanIcon } from "../assets/pan.svg";
import { ReactComponent as UndoIcon } from "../assets/undo.svg";
import { ReactComponent as RedoIcon } from "../assets/redo.svg";
import commentview from "./CommentView";

const ToolBarContainer = styled(CenterBar)`
    margin-left: auto;
    margin-right: auto;
`;

export const ToolBar = track(() => {
    const [isCommentView, setIsCommentView] = useState(false);
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

    function handleCommentToggle() {
        if (isCommentView) {
            commentview.exitCommentView();
        } else {
            commentview.enterCommentView();
        }

        setIsCommentView(!isCommentView);
    }

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
            <SquareButton
                data-isactive={isCommentView}
                onClick={handleCommentToggle}
            >
                <CommentIcon />
            </SquareButton>
            <SquareButton onClick={() => app.undo()}>
                <UndoIcon />
            </SquareButton>
            <SquareButton onClick={() => app.redo()}>
                <RedoIcon />
            </SquareButton>
        </ToolBarContainer>
    );
});
