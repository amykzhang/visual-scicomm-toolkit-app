import { useEffect } from "react";
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
    border-radius: 0px 0px 8px 8px;
`;

interface ToolBarProps {
    isPanning: boolean;
    setIsPanning: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ToolBar: React.FC<ToolBarProps> = ({
    isPanning,
    setIsPanning,
}) => {
    useEffect(() => {
        const handleKeyUp = (e: KeyboardEvent) => {
            switch (e.key) {
                case "Delete":
                case "Backspace": {
                    // app.deleteShapes();
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
                id="select-tool"
                data-isactive={!isPanning}
                onClick={() => setIsPanning(false)}
            >
                <SelectIcon />
            </SquareButton>
            <SquareButton
                id="pan-tool"
                data-isactive={isPanning}
                onClick={() => setIsPanning(true)}
            >
                <PanIcon />
            </SquareButton>
            <CommentTool />
            <SquareButton
            // onClick={() => app.undo()}
            >
                <UndoIcon />
            </SquareButton>
            <SquareButton
            // onClick={() => app.redo()}
            >
                <RedoIcon />
            </SquareButton>
        </ToolBarContainer>
    );
};
